type RouteDefinition = {
    /**
     * - The URL path (e.g., "/" or "/about").
     */
    path: string;
    /**
     * - The component name (if registered globally) or component definition.
     */
    component: string | Object;
    /**
     * - Additional properties to pass to the routed component.
     */
    props?: Object | undefined;
};
type RouterOptions = {
    /**
     * - The DOM element where routed components will be mounted.
     */
    container: HTMLElement;
    /**
     * - The routing mode: "hash", "query", or "history".
     */
    mode?: string | undefined;
    /**
     * - An array of route definitions.
     */
    routes: Array<RouteDefinition>;
    /**
     * - A default route object to use when no route matches.
     */
    defaultRoute?: RouteDefinition | undefined;
};
declare namespace ElevaRouter {
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
    function install(eleva: Object, options?: RouterOptions): void;
}

export { type RouteDefinition, type RouterOptions, ElevaRouter as default };
