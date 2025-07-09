/**
 * @class Router
 * @classdesc A Router Plugin for Eleva.js with Multiple Routing Modes
 *
 * This plugin provides client-side routing functionality for Eleva.js applications.
 * It supports hash-based (e.g. "#pageName"), query-based (e.g. "?page=pageName"),
 * and history-based (e.g. "/pageName") routing. The routing mode is configurable via
 * the plugin options.
 *
 * In addition to injecting route information (current path, query parameters,
 * and full URL) directly into the component's setup context as `route`, this plugin
 * also injects a `navigate` function so developers can programmatically navigate from within components.
 *
 * The router now supports dynamic route parameters (e.g. "/users/:id") which are passed
 * to the component via the route.params object.
 *
 * @param {Object} eleva - The Eleva instance.
 * @param {Object} options - Router configuration options.
 * @param {HTMLElement} options.layout - The app layout DOM element. The router will look for a view element
 *   (#{viewSelector} id, .{viewSelector} class, <{viewSelector}> element, or data-{viewSelector} attribute) within this layout to mount routed components.
 *   Priority is based on selection speed from fastest to slowest (micro-optimization). If no view element is found, the layout element itself will be used as the mounting target.
 * @param {string} [options.mode="hash"] - The routing mode ("hash", "query", or "history").
 * @param {Array<Object>} options.routes - An array of route objects. Each route object should have:
 *   - {string} path - The URL path (e.g. "/" or "/about" or "/users/:id").
 *   - {string|Object} component - The component name (if registered globally) or a component definition.
 *   - {Object} [props] - Additional props to pass to the component.
 * @param {string} [options.queryParam="page"] - The query parameter to use for routing.
 * @param {string} [options.viewSelector="view"] - The selector name for the view element. Used to find elements like #{viewSelector}, .{viewSelector}, <{viewSelector}>, or data-{viewSelector}.
 * @param {Object} [options.defaultRoute] - A default route object used when no route matches.
 */
class Router {
  constructor(eleva, options = {}) {
    this.eleva = eleva;
    this.layout = options.layout;
    if (!this.layout) {
      throw new Error("Router requires a layout DOM element in options.");
    }

    // Find the view element within the layout, or use layout as fallback
    this.viewSelector = options.viewSelector || "view"; // Default view selector
    this.view =
      this.layout.querySelector(`#${this.viewSelector}`) ||
      this.layout.querySelector(`.${this.viewSelector}`) ||
      this.layout.querySelector(this.viewSelector) ||
      this.layout.querySelector(`[data-${this.viewSelector}]`) ||
      this.layout;

    this.routes = options.routes || [];
    this.mode = options.mode || "hash"; // "hash", "query", or "history"
    this.queryParam = options.queryParam || "page"; // The query parameter to use for routing
    this.defaultRoute = options.defaultRoute || null;
    this.eventListeners = []; // Track event listeners for cleanup
    this.isStarted = false; // Track router state

    // Validate routing mode
    if (!["hash", "query", "history"].includes(this.mode)) {
      throw new Error(
        `Invalid routing mode: ${this.mode}. Must be "hash", "query", or "history".`
      );
    }

    // Preprocess routes to identify parameter segments
    this.routes = this.routes.map((route) => {
      return {
        ...route,
        segments: this.parsePathIntoSegments(route.path),
      };
    });
  }

  /**
   * Parses a path into segments for efficient parameter matching.
   * @param {string} path - The route path pattern (e.g. "/users/:id/profile").
   * @returns {Array} An array of segment objects with type and value.
   * @private
   */
  parsePathIntoSegments(path) {
    if (!path || typeof path !== "string") {
      throw new Error("Route path must be a non-empty string");
    }

    return path
      .split("/")
      .filter(Boolean)
      .map((segment) => {
        if (segment.startsWith(":")) {
          return { type: "param", name: segment.substring(1) };
        }
        return { type: "static", value: segment };
      });
  }

  /**
   * Starts the router by setting up event listeners and resolving the initial route.
   * @returns {Promise<void>}
   */
  async start() {
    if (this.isStarted) {
      console.warn("Router is already started");
      return;
    }

    try {
      if (this.mode === "hash") {
        const hashHandler = async () => await this.routeChanged();
        window.addEventListener("hashchange", hashHandler);
        this.eventListeners.push(() =>
          window.removeEventListener("hashchange", hashHandler)
        );
      } else if (this.mode === "query" || this.mode === "history") {
        const popstateHandler = async () => await this.routeChanged();
        window.addEventListener("popstate", popstateHandler);
        this.eventListeners.push(() =>
          window.removeEventListener("popstate", popstateHandler)
        );
      }

      this.isStarted = true;
      // Resolve the initial route
      await this.routeChanged();
    } catch (error) {
      console.error("Failed to start router:", error);
      throw error;
    }
  }

  /**
   * Stops the router and cleans up event listeners.
   * @returns {Promise<void>}
   */
  async destroy() {
    if (!this.isStarted) {
      return;
    }

    try {
      // Clean up event listeners
      this.eventListeners.forEach((cleanup) => cleanup());
      this.eventListeners = [];

      // Unmount current component
      const existingInstance = this.view._eleva_instance;
      if (existingInstance) {
        await existingInstance.unmount();
      }

      this.isStarted = false;
    } catch (error) {
      console.error("Error destroying router:", error);
      throw error;
    }
  }

  /**
   * Called when the route changes. Extracts the current route based on the routing mode,
   * parses the URL query, and mounts the corresponding component. Injects route data and
   * a navigation function directly into the component's setup context.
   * @returns {Promise<void>}
   */
  async routeChanged() {
    try {
      let path, queryString, fullUrl;

      if (this.mode === "hash") {
        fullUrl = window.location.href;
        let hash = window.location.hash.slice(1) || "";
        [path, queryString] = hash.split("?");
        // If path is empty, default to "/"
        path = path || "/";
      } else if (this.mode === "query") {
        fullUrl = window.location.href;
        const search = window.location.search; // e.g. ?page=about&foo=bar
        const urlParams = new URLSearchParams(search);
        path = urlParams.get(this.queryParam) || "";
        urlParams.delete(this.queryParam);
        queryString = urlParams.toString();
        path = path || "/";
      } else if (this.mode === "history") {
        fullUrl = window.location.href;
        path = window.location.pathname || "/";
        queryString = window.location.search
          ? window.location.search.slice(1)
          : "";
      }

      // Normalize the path: Ensure it starts with '/'
      if (path.charAt(0) !== "/") {
        path = "/" + path;
      }

      // Unmount the previous component instance if it exists
      const existingInstance = this.view._eleva_instance;
      if (existingInstance) {
        try {
          await existingInstance.unmount();
        } catch (error) {
          console.warn("Error unmounting previous component:", error);
        }
      }

      const query = this.parseQuery(queryString);

      // Try to find a matching route for the current path
      const matchResult = this.matchRoute(path);

      // Use defaultRoute if no matching route is found
      if (!matchResult && this.defaultRoute) {
        try {
          const wrappedComponent = this.wrapComponentWithRoute(
            this.defaultRoute.component,
            {
              path,
              query,
              fullUrl,
              params: {},
              matchedRoute: this.defaultRoute.path,
            }
          );
          const props = this.defaultRoute.props || {};
          await this.eleva.mount(this.view, wrappedComponent, props);
        } catch (error) {
          console.error("Error mounting default route component:", error);
        }
      } else if (matchResult) {
        try {
          const { route, params } = matchResult;
          const wrappedComponent = this.wrapComponentWithRoute(
            route.component,
            {
              path,
              query,
              fullUrl,
              params,
              matchedRoute: route.path,
            }
          );
          const props = route.props || {};
          await this.eleva.mount(this.view, wrappedComponent, props);
        } catch (error) {
          console.error("Error mounting route component:", error);
        }
      } else {
        console.warn(`No route found for path: ${path}`);
      }
    } catch (error) {
      console.error("Error in route change:", error);
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

    try {
      queryString.split("&").forEach((pair) => {
        const [key, value] = pair.split("=");
        if (key) {
          query[decodeURIComponent(key)] = value
            ? decodeURIComponent(value)
            : "";
        }
      });
    } catch (error) {
      console.warn("Error parsing query string:", error);
    }

    return query;
  }

  /**
   * Finds a matching route for the specified path.
   * Supports dynamic route parameters (e.g. "/users/:id").
   * @param {string} path - The current path extracted from the URL.
   * @returns {Object|null} An object containing the matched route and extracted parameters, or null if no match is found.
   */
  matchRoute(path) {
    // Input validation
    if (!path || typeof path !== "string") {
      console.warn("Invalid path provided to matchRoute:", path);
      return null;
    }

    try {
      // Handle root path special case
      if (path === "/") {
        const rootRoute = this.routes.find((route) => route.path === "/");
        if (rootRoute) {
          return { route: rootRoute, params: {} };
        }
        return null;
      }

      // Split the current path into segments for matching
      const pathSegments = path.split("/").filter(Boolean);

      // Try to match against all routes
      for (const route of this.routes) {
        try {
          // Skip the root route as we've already handled it
          if (route.path === "/") continue;

          const routeSegments = route.segments;

          // Quick length check (except for catch-all routes with wildcard segments)
          const hasCatchAll = routeSegments.some(
            (s) => s.type === "param" && s.name.endsWith("*")
          );
          if (!hasCatchAll && routeSegments.length !== pathSegments.length) {
            continue;
          }

          // Try to match segment by segment
          const params = {};
          let isMatch = true;

          for (let i = 0; i < routeSegments.length; i++) {
            const routeSegment = routeSegments[i];
            const pathSegment = pathSegments[i];

            // Path is shorter than route definition
            if (pathSegment === undefined) {
              isMatch = false;
              break;
            }

            if (routeSegment.type === "static") {
              // For static segments, direct comparison
              if (routeSegment.value !== pathSegment) {
                isMatch = false;
                break;
              }
            } else if (routeSegment.type === "param") {
              // Handle catch-all parameters (e.g. ":path*")
              if (routeSegment.name.endsWith("*")) {
                const paramName = routeSegment.name.slice(0, -1);
                params[paramName] = pathSegments.slice(i).join("/");
                break; // This will match all remaining segments
              }

              // For parameter segments, store the value
              params[routeSegment.name] = pathSegment;
            }
          }

          if (isMatch) {
            return { route, params };
          }
        } catch (error) {
          console.warn(`Error matching route ${route.path}:`, error);
          continue;
        }
      }

      return null;
    } catch (error) {
      console.error("Error in matchRoute:", error);
      return null;
    }
  }

  /**
   * Programmatically navigates to the specified route.
   * Updates the URL based on the routing mode and triggers route resolution.
   * @param {string} path - The target route path.
   * @param {Object} [params] - Route parameters to inject into the path.
   * @returns {Promise<void>}
   */
  async navigate(path, params = {}) {
    if (!path || typeof path !== "string") {
      console.error("Invalid path provided to navigate:", path);
      return;
    }

    try {
      // If params are provided, replace parameter placeholders in the path
      if (params && Object.keys(params).length > 0) {
        Object.keys(params).forEach((key) => {
          path = path.replace(`:${key}`, encodeURIComponent(params[key]));
        });
      }

      if (this.mode === "hash") {
        if (path === "/" || path === "") {
          // For root path, clear hash completely
          window.location.hash = "";
        } else {
          // For other paths, set hash (this triggers hashchange automatically)
          window.location.hash = path;
        }
      } else if (this.mode === "query") {
        const urlParams = new URLSearchParams(window.location.search);
        if (path === "/" || path === "") {
          urlParams.delete(this.queryParam);
        } else {
          urlParams.set(this.queryParam, path);
        }
        const newQuery = urlParams.toString();
        const newUrl =
          window.location.pathname + (newQuery ? "?" + newQuery : "");
        history.pushState({}, "", newUrl);
        await this.routeChanged();
      } else if (this.mode === "history") {
        history.pushState({}, "", path);
        await this.routeChanged();
      }
    } catch (error) {
      console.error("Error navigating to path:", path, error);
    }
  }

  /**
   * Adds a new route to the router.
   * @param {Object} route - The route object to add.
   * @returns {void}
   */
  addRoute(route) {
    if (!route || !route.path || !route.component) {
      throw new Error("Route must have both 'path' and 'component' properties");
    }

    try {
      // Preprocess the route to identify parameter segments
      route.segments = this.parsePathIntoSegments(route.path);
      this.routes.push(route);
    } catch (error) {
      console.error("Error adding route:", error);
      throw error;
    }
  }

  /**
   * Wraps a component definition so that its setup function receives the route information
   * and the navigate function directly in the context.
   * @param {string|Object} comp - The component name (if registered globally) or component definition.
   * @param {Object} routeInfo - An object containing route information (path, query, fullUrl, params).
   * @returns {Object} A new component definition with an augmented setup function.
   */
  wrapComponentWithRoute(comp, routeInfo) {
    let definition;
    if (typeof comp === "string") {
      definition = this.eleva._components.get(comp);
      if (!definition) {
        throw new Error(`Component "${comp}" not registered.`);
      }
    } else {
      definition = comp;
    }

    // Create a shallow copy of the component definition
    const wrapped = { ...definition };
    const originalSetup = wrapped.setup;

    // Override the setup function to inject route information
    wrapped.setup = (ctx) => {
      ctx.route = routeInfo;
      // Bind navigate with the router instance and wrap it to support params
      const originalNavigate = this.navigate.bind(this);
      ctx.navigate = (path, params) => originalNavigate(path, params);
      // Inject route information and navigation function into the context
      return originalSetup ? originalSetup(ctx) : {};
    };

    // If this component has children, we need to modify its children handling
    if (wrapped.children) {
      const originalChildren = { ...wrapped.children };
      wrapped.children = {};

      // For each child component, wrap it to also include route information
      Object.keys(originalChildren).forEach((childKey) => {
        const childComp = originalChildren[childKey];
        wrapped.children[childKey] = this.wrapComponentWithRoute(
          childComp,
          routeInfo
        );
      });
    }

    return wrapped;
  }
}

/**
 * @typedef {Object} RouteDefinition
 * @property {string} path - The URL path (e.g., "/" or "/about" or "/users/:id").
 * @property {string|Object} component - The component name (if registered globally) or a component definition.
 * @property {Object} [props] - Additional properties to pass to the routed component.
 */

/**
 * @typedef {Object} RouterOptions
 * @property {HTMLElement} layout - The app layout DOM element. The router will look for a view element
 *   (with data-view attribute, .view class, or #view id) within this layout to mount routed components.
 *   If no view element is found, the layout element itself will be used as the mounting target.
 * @property {string} [mode="hash"] - The routing mode: "hash", "query", or "history".
 * @property {Array<RouteDefinition>} routes - An array of route definitions.
 * @property {RouteDefinition} [defaultRoute] - A default route object to use when no route matches.
 * @property {boolean} [autoStart=true] - Whether to automatically start the router.
 * If set to false, the router must be manually started using eleva.router.start().
 */

/**
 * @namespace ElevaRouter
 * @description ElevaRouter is the official router plugin for Eleva.js.
 *
 * It provides client-side routing functionality with support for multiple routing modes,
 * automatic component registration, and route information injection into the setup context.
 *
 * Installs the ElevaRouter plugin into an Eleva.js instance.
 * Automatically registers routed components if provided as definitions.
 *
 * @param {Object} eleva - The Eleva instance.
 * @param {RouterOptions} options - Router configuration options.
 * @param {boolean} [options.autoStart=true] - Whether to automatically start the router.
 * If set to false, the router must be manually started using eleva.router.start().
 * @returns {void}
 */
const ElevaRouter = {
  name: "ElevaRouter",
  install(eleva, options = {}) {
    try {
      // Automatically register routed components if provided as definitions
      const routes = options.routes || [];
      let autoRegCounter = 0;

      routes.forEach((route) => {
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

      // Handle auto-start asynchronously without blocking plugin installation
      const shouldAutoStart = options.autoStart !== false;
      if (shouldAutoStart) {
        queueMicrotask(async () => {
          try {
            await router.start();
          } catch (error) {
            console.error("Failed to auto-start router:", error);
          }
        });
      }
    } catch (error) {
      console.error("Failed to install ElevaRouter plugin:", error);
      throw error;
    }
  },
};

export default ElevaRouter;
