/* @eleva/router v1.0.0-alpha | MIT License */
/**
 * @class Router
 * @classdesc A router for Eleva.js that supports multiple routing modes:
 * "hash", "query", and "history". It extracts the current route information
 * (path, query parameters, full URL) and injects it into routed components'
 * setup context along with a `navigate` function.
 *
 * @param {Object} eleva - The Eleva instance.
 * @param {Object} options - Router configuration options.
 * @param {HTMLElement} options.container - The DOM element where routed components will be mounted.
 * @param {string} [options.mode="hash"] - The routing mode ("hash", "query", or "history").
 * @param {Array<Object>} options.routes - An array of route objects. Each route object should have:
 *   - {string} path - The URL path (e.g. "/" or "/about").
 *   - {string|Object} component - The component name (if registered globally) or a component definition.
 *   - {Object} [props] - Additional props to pass to the component.
 * @param {Object} [options.defaultRoute] - A default route object used when no route matches.
 */
class Router {
  constructor(eleva, options = {}) {
    this.eleva = eleva;
    this.container = options.container;
    if (!this.container) {
      throw new Error("Router requires a container DOM element in options.");
    }
    this.routes = options.routes || [];
    this.mode = options.mode || "hash"; // "hash", "query", or "history"
    this.defaultRoute = options.defaultRoute || null;
  }

  /**
   * Starts the router by setting up event listeners and resolving the initial route.
   * @returns {void}
   */
  start() {
    if (this.mode === "hash") {
      window.addEventListener("hashchange", () => this.routeChanged());
    } else if (this.mode === "query" || this.mode === "history") {
      window.addEventListener("popstate", () => this.routeChanged());
    } else {
      throw new Error(`Invalid routing mode: ${this.mode}`);
    }
    // Resolve the initial route.
    this.routeChanged();
  }

  /**
   * Called when the route changes. Extracts the current route based on the routing mode,
   * parses the URL query, and mounts the corresponding component. Injects route data and
   * a navigation function directly into the component's setup context.
   * @returns {void}
   */
  routeChanged() {
    let path, queryString, fullUrl;
    if (this.mode === "hash") {
      fullUrl = window.location.href;
      let hash = window.location.hash.slice(1) || "/";
      [path, queryString] = hash.split("?");
      path = path || "/";
    } else if (this.mode === "query") {
      fullUrl = window.location.href;
      const search = window.location.search; // e.g. ?page=about&foo=bar
      const urlParams = new URLSearchParams(search);
      path = urlParams.get("page") || "/";
      urlParams.delete("page");
      queryString = urlParams.toString();
    } else if (this.mode === "history") {
      fullUrl = window.location.href;
      path = window.location.pathname || "/";
      queryString = window.location.search ? window.location.search.slice(1) : "";
    } else {
      throw new Error("Invalid router mode: " + this.mode);
    }
    const query = this.parseQuery(queryString);
    // Try to find a matching route for the current path.
    let route = this.matchRoute(path);
    // Use defaultRoute if no matching route is found.
    if (!route && this.defaultRoute) {
      route = this.defaultRoute;
    }
    if (route) {
      const wrappedComponent = this.wrapComponentWithRoute(route.component, {
        path,
        query,
        fullUrl
      });
      const props = route.props || {};
      this.eleva.mount(this.container, wrappedComponent, props);
    }
  }

  /**
   * Parses a query string into an object.
   * @param {string} queryString - The query string portion of a URL.
   * @returns {Object} An object containing key-value pairs for query parameters.
   */
  parseQuery(queryString) {
    const query = {};
    if (!queryString) return query;
    queryString.split("&").forEach(pair => {
      const [key, value] = pair.split("=");
      if (key) {
        query[decodeURIComponent(key)] = value ? decodeURIComponent(value) : "";
      }
    });
    return query;
  }

  /**
   * Finds a matching route for the specified path.
   * @param {string} path - The current path extracted from the URL.
   * @returns {Object|undefined} The matching route object, or undefined if no match is found.
   */
  matchRoute(path) {
    return this.routes.find(route => route.path === path);
  }

  /**
   * Programmatically navigates to the specified route.
   * Updates the URL based on the routing mode and triggers route resolution.
   * @param {string} path - The target route path.
   * @returns {void}
   */
  navigate(path) {
    if (this.mode === "hash") {
      window.location.hash = path;
    } else if (this.mode === "query") {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("page", path);
      const newUrl = window.location.pathname + "?" + urlParams.toString();
      history.pushState({}, "", newUrl);
      this.routeChanged();
    } else if (this.mode === "history") {
      history.pushState({}, "", path);
      this.routeChanged();
    }
  }

  /**
   * Adds a new route to the router.
   * @param {Object} route - The route object to add.
   * @returns {void}
   */
  addRoute(route) {
    this.routes.push(route);
  }

  /**
   * Wraps a component definition so that its setup function receives the route information
   * and the navigate function directly in the context.
   * @param {string|Object} comp - The component name (if registered globally) or component definition.
   * @param {Object} routeInfo - An object containing route information (path, query, fullUrl).
   * @returns {Object} A new component definition with an augmented setup function.
   */
  wrapComponentWithRoute(comp, routeInfo) {
    let definition = comp;
    if (typeof comp === "string") {
      definition = this.eleva._components[comp];
      if (!definition) {
        throw new Error(`Component "${comp}" not registered.`);
      }
    }
    // Create a shallow copy of the component definition.
    const wrapped = {
      ...definition
    };
    const originalSetup = wrapped.setup;
    wrapped.setup = ctx => {
      const data = originalSetup ? originalSetup(ctx) : {};
      // Inject route information and navigation function into the context.
      return Object.assign({}, data, {
        route: routeInfo,
        navigate: this.navigate.bind(this)
      });
    };
    return wrapped;
  }
}

/**
 * @typedef {Object} RouteDefinition
 * @property {string} path - The URL path (e.g., "/" or "/about").
 * @property {string|Object} component - The component name (if registered globally) or component definition.
 * @property {Object} [props] - Additional properties to pass to the routed component.
 */

/**
 * @typedef {Object} RouterOptions
 * @property {HTMLElement} container - The DOM element where routed components will be mounted.
 * @property {string} [mode="hash"] - The routing mode: "hash", "query", or "history".
 * @property {Array<RouteDefinition>} routes - An array of route definitions.
 * @property {RouteDefinition} [defaultRoute] - A default route object to use when no route matches.
 */

/**
 * @namespace ElevaRouter
 * @description ElevaRouter is the official router plugin for Eleva.js. It provides client-side routing
 * functionality with support for multiple routing modes, automatic component registration, and route
 * information injection into the setup context.
 */
const ElevaRouter = {
  /**
   * Installs the ElevaRouter plugin into an Eleva.js instance.
   * Automatically registers routed components if provided as definitions.
   *
   * @param {Object} eleva - The Eleva instance.
   * @param {RouterOptions} options - Router configuration options.
   * @returns {void}
   *
   * @example
   * import Eleva from "eleva";
   * import ElevaRouter from "@eleva/router";
   *
   * const app = new Eleva("MyApp");
   *
   * const HomeComponent = {
   *   setup: ({ route }) => {
   *     console.log("Current route:", route.path);
   *     return {};
   *   },
   *   template: () => `<div>Welcome Home!</div>`
   * };
   *
   * const AboutComponent = {
   *   setup: ({ route, navigate }) => {
   *     function goHome() { navigate("/"); }
   *     return { goHome };
   *   },
   *   template: (ctx) => `
   *     <div>
   *       <h1>About Us</h1>
   *       <button @click="goHome">Go Home</button>
   *     </div>
   *   `
   * };
   *
   * const NotFoundComponent = {
   *   setup: ({ route, navigate }) => ({ goHome: () => navigate("/") }),
   *   template: (ctx) => `
   *     <div>
   *       <h1>404 - Not Found</h1>
   *       <button @click="goHome">Return Home</button>
   *     </div>
   *   `
   * };
   *
   * app.use(ElevaRouter, {
   *   container: document.getElementById("view"),
   *   mode: "history", // "hash", "query", or "history"
   *   routes: [
   *     { path: "/", component: HomeComponent },
   *     { path: "/about", component: AboutComponent }
   *   ],
   *   defaultRoute: { path: "/404", component: NotFoundComponent }
   * });
   *
   * // Navigate programmatically:
   * app.router.navigate("/about");
   */
  install(eleva, options = {}) {
    // Automatically register routed components if provided as definitions.
    const routes = options.routes || [];
    let autoRegCounter = 0;
    routes.forEach(route => {
      if (typeof route.component === "object") {
        let compName = route.component.name;
        if (!compName) {
          compName = "AutoRegComponent_" + autoRegCounter++;
        }
        eleva.component(compName, route.component);
        route.component = compName;
      }
    });
    const router = new Router(eleva, options);
    eleva.router = router;
    router.start();
  }
};

export { ElevaRouter as default };
//# sourceMappingURL=eleva-router.esm.js.map
