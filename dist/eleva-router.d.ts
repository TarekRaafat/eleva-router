type RouteDefinition = {
    /**
     * - The URL path (e.g., "/" or "/about").
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
};
declare namespace ElevaRouter {
    function install(eleva: any, options?: {}): void;
}

export { type RouteDefinition, type RouterOptions, ElevaRouter as default };
