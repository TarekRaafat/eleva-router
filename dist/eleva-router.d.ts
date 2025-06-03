type RouteDefinition = {
    /**
     * - The URL path (e.g., "/" or "/about" or "/users/:id").
     */
    path: string;
    /**
     * - The component name (if registered globally) or a component definition.
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
    /**
     * - Whether to automatically start the router.
     * If set to false, the router must be manually started using eleva.router.start().
     */
    autoStart?: boolean | undefined;
};
declare namespace ElevaRouter {
    let name: string;
    function install(eleva: any, options?: {}): void;
}

export { ElevaRouter as default };
export type { RouteDefinition, RouterOptions };
