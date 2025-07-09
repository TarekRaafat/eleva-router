# Eleva Router Documentation

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/tarekraafat/eleva-router?label=github)](https://github.com/TarekRaafat/eleva-router)
[![Version](https://img.shields.io/npm/v/eleva-router.svg?style=flat)](https://www.npmjs.com/package/eleva-router)
![100% Javascript](https://img.shields.io/github/languages/top/TarekRaafat/eleva-router?color=yellow)
![Zero Dependencies](https://img.shields.io/badge/dependencies-0-green.svg)
[![Minified Size](https://badgen.net/bundlephobia/min/eleva-router)](https://bundlephobia.com/package/eleva-router)
[![Gzipped Size](https://badgen.net/bundlephobia/minzip/eleva-router)](https://bundlephobia.com/package/eleva-router)

**Eleva Router** is the official router plugin for Eleva.js, a minimalist, lightweight, pure vanilla JavaScript frontend runtime framework. This plugin provides flexible client-side routing functionality for Eleva.js applications. It supports three routing modes—hash, query, and history—and automatically injects route information (path, query parameters, dynamic route parameters, and full URL) along with a navigation function directly into your component's setup context.

**Version:** `v1.1.0-alpha`

> **Status:** Stable release with enhanced error handling, memory management, and dynamic route parameters support.

---

## Table of Contents

- [Eleva Router Documentation](#eleva-router-documentation)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Installation](#installation)
  - [Configuration Options](#configuration-options)
    - [Routing Modes](#routing-modes)
    - [Routes](#routes)
    - [Default Route](#default-route)
    - [Auto-Start Control](#auto-start-control)
    - [Query Parameter Configuration](#query-parameter-configuration)
  - [Usage](#usage)
    - [Basic Setup](#basic-setup)
    - [Manual Router Control](#manual-router-control)
    - [Accessing Route Information](#accessing-route-information)
    - [Dynamic Route Parameters](#dynamic-route-parameters)
    - [Programmatic Navigation](#programmatic-navigation)
    - [Router Lifecycle Management](#router-lifecycle-management)
  - [API Reference](#api-reference)
    - [Router Class](#router-class)
      - [Constructor](#constructor)
      - [Core Methods](#core-methods)
      - [Navigation Methods](#navigation-methods)
      - [Route Management](#route-management)
      - [Component Integration](#component-integration)
    - [ElevaRouter Plugin Object](#elevarouter-plugin-object)
  - [Examples](#examples)
    - [Example: Basic Hash Routing](#example-basic-hash-routing)
    - [Example: Query Routing](#example-query-routing)
    - [Example: History Routing](#example-history-routing)
    - [Example: Dynamic Route Parameters](#example-dynamic-route-parameters)
    - [Example: Custom Query Parameters](#example-custom-query-parameters)
    - [Example: Manual Router Control](#example-manual-router-control)
    - [Example: Error Handling](#example-error-handling)
  - [Error Handling \& Recovery](#error-handling--recovery)
    - [Built-in Error Recovery](#built-in-error-recovery)
    - [Custom Error Handling](#custom-error-handling)
  - [Performance \& Memory Management](#performance--memory-management)
    - [Automatic Cleanup](#automatic-cleanup)
    - [Memory Leak Prevention](#memory-leak-prevention)
  - [Best Practices](#best-practices)
  - [Migration Guide](#migration-guide)
    - [From v1.0.x to v1.1.x](#from-v10x-to-v11x)
  - [FAQ](#faq)
  - [Troubleshooting](#troubleshooting)
  - [Contribution \& Support](#contribution--support)
  - [License](#license)

---

## Overview

The **Eleva Router** plugin extends Eleva.js with robust client-side routing capabilities. It supports:

- **Hash-based Routing:** Uses URL hash (e.g., `#pageName`) for routing.
- **Query-based Routing:** Uses URL query parameters (e.g., `?page=pageName`) where the `page` query is used as the route.
- **History-based Routing:** Uses the HTML5 History API (e.g., `/pageName`) for clean URLs.

The plugin automatically injects a `route` object and a `navigate` function into your component's setup context so that you can easily access current route information and perform navigation programmatically. With v1.1.0-alpha, the plugin includes enhanced error handling, memory management, and support for dynamic route parameters.

---

## Features

- **Multiple Routing Modes:** Configure your routing strategy as "hash", "query", or "history".
- **Dynamic Route Parameters:** Support for path parameters using colon syntax (e.g., `/users/:id`) and catch-all wildcards (e.g., `/files/:path*`).
- **Automatic Component Registration:** Automatically register routed components provided as definitions, reducing redundancy.
- **Route Information Injection:** The current route (path, query parameters, route parameters, and full URL) is injected directly into your component's context as `route`.
- **Programmatic Navigation:** A `navigate` function is provided in the context to change routes from within your components.
- **Default Route Fallback:** Define a default route to be used when no routes match.
- **Seamless Integration:** Built to work perfectly with Eleva.js with deferred async initialization.
- **Enhanced Error Handling:** Comprehensive error recovery for component mounting failures and malformed routes.
- **Memory Management:** Automatic cleanup of event listeners and component instances to prevent memory leaks.
- **Router State Management:** Built-in protection against double initialization and proper lifecycle management.
- **Input Validation:** Comprehensive validation for routes, paths, and parameters to prevent runtime errors.

---

## Installation

Install via npm:

```bash
npm install eleva-router
```

Or include it directly via CDN:

```html
<!-- jsDelivr (Recommended) -->
<script src="https://cdn.jsdelivr.net/npm/eleva-router"></script>
```

or

```html
<!-- unpkg -->
<script src="https://unpkg.com/eleva-router"></script>
```

---

## Configuration Options

When installing the plugin via `app.use()`, you can pass a configuration object with the following options:

### Routing Modes

- **mode** (string): The routing mode to use. Options:
  - `"hash"` (default) – Uses `window.location.hash` (e.g., `#pageName`).
  - `"query"` – Uses `window.location.search` with a configurable query parameter (e.g., `?page=pageName` or `?view=pageName`).
  - `"history"` – Uses `window.location.pathname` with the History API (e.g., `/pageName`).

### Routes

- **routes** (array): An array of route objects. Each route object can contain:
  - **path** (string): The route path (e.g., `"/"`, `"/about"`, or dynamic paths like `"/users/:id"`).
  - **component** (string or Object): Either a globally registered component name or a component definition.
  - **props** (object, optional): Additional props to pass to the routed component.

### Default Route

- **defaultRoute** (object, optional): A route object to be used as a fallback when no other route matches. It has the same structure as the other route objects.

### Auto-Start Control

- **autoStart** (boolean, default: `true`): Whether to automatically start the router after plugin installation. If set to `false`, you must manually call `await app.router.start()`.

### Query Parameter Configuration

- **queryParam** (string, default: `"page"`): The query parameter name used for query mode routing. Only applies when `mode` is set to `"query"`. Allows customization of the URL parameter name (e.g., `"view"` for `?view=about` instead of `?page=about`).

---

## Usage

### Basic Setup

Below is an example of setting up Eleva Router with Eleva.js:

````js
import Eleva from "eleva";
import ElevaRouter from "eleva-router";

const app = new Eleva("MyApp");

// Define routed components (no need for separate registration)
const HomeComponent = {
  setup: ({ route }) => {
    console.log("Home route:", route.path);
    return {};
  },
  template: () => `<div>Welcome Home!</div>`,
};

const AboutComponent = {
  setup: ({ route, navigate }) => {
    function goHome() {
      navigate("/");
    }
    return { goHome };
  },
  template: (ctx) => `
    <div>
      <h1>About Us</h1>
      <button @click="goHome">Go Home</button>
    </div>
  `,
};

const NotFoundComponent = {
  setup: ({ route, navigate }) => ({
    goHome: () => navigate("/"),
  }),
  template: (ctx) => `
    <div>
      <h1>404 - Not Found</h1>
      <button @click="goHome">Return Home</button>
    </div>
  `,
};

// Install the router plugin
app.use(ElevaRouter, {
  layout: document.getElementById("app"),
  mode: "history", // Can be "hash", "query", or "history"
  routes: [
    { path: "/", component: HomeComponent },
    { path: "/about", component: AboutComponent },
  ],
  defaultRoute: { path: "/404", component: NotFoundComponent },
});

// Router starts automatically unless autoStart: false

### App Layout and View Element

The router uses an app layout concept where you provide a layout element that contains a dedicated view element for mounting routed components. This allows you to maintain persistent layout elements (like navigation, headers, footers) while only the view content changes during navigation.

The router automatically looks for a view element within your layout using the following selectors (in order of priority, based on selection speed):
1. `#view` - Element with `view` id (fastest - ID selector)
2. `.view` - Element with `view` class (fast - class selector)
3. `<view>` - Native `<view>` HTML element (medium - tag selector)
4. `[data-view]` - Element with `data-view` attribute (slowest - attribute selector)
5. Falls back to the layout element itself if no view element is found

> **Note:** The difference in selection speed between these selector types is negligible for most practical cases. This ordering is a micro-optimization that may provide minimal performance benefits in applications with very frequent route changes.

**Example HTML Structure:**

```html
<div id="app">
  <!-- This is your layout element -->
  <header>
    <nav>
      <a href="#/">Home</a>
      <a href="#/about">About</a>
    </nav>
  </header>

  <!-- This is your view element - router will mount components here -->
  <main data-view></main>

  <footer>
    <p>&copy; 2024 My App</p>
  </footer>
</div>
```

**Alternative View Element Selectors:**

```html
<!-- Using ID (highest priority) -->
<div id="app">
  <header>...</header>
  <main id="view"></main>
  <!-- Router will use this -->
  <footer>...</footer>
</div>

<!-- Using native <view> element -->
<div id="app">
  <header>...</header>
  <view></view>
  <!-- Router will use this -->
  <footer>...</footer>
</div>

<!-- Using class -->
<div id="app">
  <header>...</header>
  <main class="view"></main>
  <!-- Router will use this -->
  <footer>...</footer>
</div>

<!-- Using data-view attribute -->
<div id="app">
  <header>...</header>
  <main data-view></main>
  <!-- Router will use this -->
  <footer>...</footer>
</div>

<!-- Fallback to layout -->
<div id="app">
  <!-- No view element found, router will use this div -->
</div>
```

````

### Manual Router Control

For applications that need precise control over router initialization:

```js
app.use(ElevaRouter, {
  layout: document.getElementById("app"),
  mode: "history",
  routes: [
    { path: "/", component: HomeComponent },
    { path: "/about", component: AboutComponent },
  ],
  autoStart: false, // Disable auto-start
});

// Start the router manually when ready
try {
  await app.router.start();
  console.log("Router started successfully");
} catch (error) {
  console.error("Failed to start router:", error);
}

// Clean up when done (e.g., during app shutdown)
await app.router.destroy();
```

### Accessing Route Information

Within any routed component, route information is injected directly into the setup context as `route`. For example:

```js
const MyComponent = {
  setup: ({ route, navigate }) => {
    console.log("Current path:", route.path);
    console.log("Query parameters:", route.query);
    console.log("Route parameters:", route.params);
    console.log("Matched route pattern:", route.matchedRoute);
    console.log("Full URL:", route.fullUrl);

    // You can also navigate programmatically:
    // navigate("/about");

    return {};
  },
  template: (ctx) => `<div>Content here</div>`,
};
```

### Dynamic Route Parameters

Eleva Router v1.1.0-alpha now supports dynamic route segments using the colon syntax:

```js
app.use(ElevaRouter, {
  layout: document.getElementById("app"),
  mode: "history",
  routes: [
    { path: "/", component: HomeComponent },
    { path: "/users/:id", component: UserDetailComponent },
    { path: "/blog/:category/:slug", component: BlogPostComponent },
    { path: "/files/:path*", component: FileViewerComponent }, // Catch-all parameter
  ],
});
```

Access dynamic parameters within your components:

```js
const UserDetailComponent = {
  setup: ({ route, navigate }) => {
    console.log("User ID:", route.params.id); // e.g., "123" for URL "/users/123"

    return {
      userId: route.params.id,
      goToUser: (id) => navigate("/users/:id", { id }), // Programmatic navigation with params
    };
  },
  template: (ctx) => `
    <div>
      <h1>User Profile: ${ctx.userId}</h1>
      <button @click="goToUser(456)">View User 456</button>
    </div>
  `,
};
```

### Programmatic Navigation

From within a component or externally, you can navigate by calling the `navigate` function:

- **Within a component:** Access via the setup context:

  ```js
  // Simple navigation
  navigate("/about");

  // With route parameters
  navigate("/users/:id", { id: 123 });

  // Navigation with error handling
  try {
    await navigate("/dashboard");
  } catch (error) {
    console.error("Navigation failed:", error);
  }
  ```

- **From outside:** Use the router instance:
  ```js
  await app.router.navigate("/about");
  await app.router.navigate("/users/:id", { id: 123 });
  ```

### Router Lifecycle Management

Properly manage the router lifecycle for optimal performance:

```js
// Check if router is running
console.log("Router is active:", app.router.isStarted);

// Clean up the router when your application shuts down
await app.router.destroy();

// Add cleanup to page unload for browser applications
window.addEventListener("beforeunload", async () => {
  await app.router.destroy();
});
```

---

## API Reference

### Router Class

#### Constructor

```js
new Router(eleva, options);
```

- **eleva:** The Eleva.js instance.
- **options:** Configuration object with:
  - `layout`: (HTMLElement) App layout element. Router looks for a view element (#view, .view, <view>, or data-view) within this layout to mount components. Priority based on selection speed (micro-optimization). If no view element is found, the layout itself is used.
  - `mode`: (string) "hash" (default), "query", or "history".
  - `queryParam`: (string) Query parameter name for query mode (default: "page").
  - `routes`: (array) Array of route objects.
  - `defaultRoute`: (object, optional) A fallback route object.

#### Core Methods

- **async start():**
  Starts the router by listening for route changes and processing the initial route. Throws an error if startup fails.

  ```js
  try {
    await app.router.start();
  } catch (error) {
    console.error("Router startup failed:", error);
  }
  ```

- **async destroy():**
  Stops the router, cleans up all event listeners, and unmounts the current component. Safe to call multiple times.

  ```js
  await app.router.destroy();
  ```

- **async routeChanged():**
  Internal method called on URL changes; extracts the current path and query parameters, and mounts the corresponding component. Includes comprehensive error handling.

#### Navigation Methods

- **async navigate(path, params):**
  Programmatically navigates to a given path. Optionally accepts a params object for route parameters.

  ```js
  await app.router.navigate("/users/:id", { id: 123 });
  ```

#### Route Management

- **addRoute(route):**
  Dynamically adds a new route. Validates route structure before adding.

  ```js
  app.router.addRoute({
    path: "/new-page",
    component: NewPageComponent,
    props: { title: "New Page" },
  });
  ```

- **matchRoute(path):**
  Finds a matching route for the specified path. Returns an object with the matched route and extracted parameters, or null if no match.

  ```js
  const match = app.router.matchRoute("/users/123");
  // Returns: { route: {...}, params: { id: "123" } }
  ```

#### Component Integration

- **wrapComponentWithRoute(comp, routeInfo):**
  Internal method that wraps a component definition so that its setup function receives the `route` and `navigate` properties directly.

### ElevaRouter Plugin Object

- **install(eleva, options):**
  Installs the router plugin into an Eleva.js instance. Automatically registers routed components (if provided as definitions), attaches the Router instance to `eleva.router`, and optionally starts the router.

  The installation process:

  1. Validates options and layout element
  2. Auto-registers component definitions
  3. Creates and attaches router instance
  4. Defers async startup using `queueMicrotask` if `autoStart` is true

---

## Examples

### Example: Basic Hash Routing

```js
app.use(ElevaRouter, {
  layout: document.getElementById("app"),
  mode: "hash",
  routes: [
    { path: "/", component: HomeComponent },
    { path: "/contact", component: ContactComponent },
  ],
  defaultRoute: { path: "/404", component: NotFoundComponent },
});
```

### Example: Query Routing

```js
// Default query parameter
app.use(ElevaRouter, {
  layout: document.getElementById("app"),
  mode: "query",
  routes: [
    { path: "/", component: HomeComponent },
    { path: "/services", component: ServicesComponent },
  ],
});
// URLs: ?page=/, ?page=/services

// Custom query parameter
app.use(ElevaRouter, {
  layout: document.getElementById("app"),
  mode: "query",
  queryParam: "view", // Custom parameter name
  routes: [
    { path: "/", component: HomeComponent },
    { path: "/services", component: ServicesComponent },
  ],
});
// URLs: ?view=/, ?view=/services
```

### Example: History Routing

```js
app.use(ElevaRouter, {
  layout: document.getElementById("app"),
  mode: "history",
  routes: [
    { path: "/", component: HomeComponent },
    { path: "/about", component: AboutComponent },
  ],
});
```

### Example: Dynamic Route Parameters

```js
app.use(ElevaRouter, {
  layout: document.getElementById("app"),
  mode: "history",
  routes: [
    { path: "/", component: HomeComponent },
    { path: "/products/:category", component: ProductCategoryComponent },
    { path: "/products/:category/:id", component: ProductDetailComponent },
    { path: "/files/:path*", component: FileViewerComponent }, // Catch-all
  ],
});

// In your component:
const ProductDetailComponent = {
  setup: ({ route }) => {
    // For URL "/products/electronics/12345"
    console.log(route.params.category); // "electronics"
    console.log(route.params.id); // "12345"
    return {
      category: route.params.category,
      productId: route.params.id,
    };
  },
  template: (ctx) => `
    <div>
      <h1>Product: ${ctx.productId}</h1>
      <p>Category: ${ctx.category}</p>
    </div>
  `,
};
```

### Example: Custom Query Parameters

```js
// E-commerce application
app.use(ElevaRouter, {
  layout: document.getElementById("app"),
  mode: "query",
  queryParam: "category",
  routes: [
    { path: "/", component: HomeComponent },
    { path: "/electronics", component: ElectronicsComponent },
    { path: "/books", component: BooksComponent },
  ],
});
// URLs: ?category=/, ?category=/electronics, ?category=/books

// Admin panel
app.use(ElevaRouter, {
  layout: document.getElementById("app"),
  mode: "query",
  queryParam: "section",
  routes: [
    { path: "/", component: DashboardComponent },
    { path: "/users", component: UsersComponent },
    { path: "/settings", component: SettingsComponent },
  ],
});
// URLs: ?section=/, ?section=/users, ?section=/settings

// Content management
app.use(ElevaRouter, {
  layout: document.getElementById("app"),
  mode: "query",
  queryParam: "content",
  routes: [
    { path: "/", component: OverviewComponent },
    { path: "/articles", component: ArticlesComponent },
    { path: "/pages", component: PagesComponent },
  ],
});
// URLs: ?content=/, ?content=/articles, ?content=/pages
```

### Example: Manual Router Control

```js
const app = new Eleva("MyApp");

app.use(ElevaRouter, {
  layout: document.getElementById("app"),
  mode: "history",
  routes: [
    { path: "/", component: HomeComponent },
    { path: "/dashboard", component: DashboardComponent },
  ],
  autoStart: false, // Manual control
});

// Start when ready
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await app.router.start();
    console.log("Application routing initialized");
  } catch (error) {
    console.error("Failed to initialize routing:", error);
  }
});

// Clean up on page unload
window.addEventListener("beforeunload", async () => {
  await app.router.destroy();
});
```

### Example: Error Handling

```js
const ErrorBoundaryComponent = {
  setup: ({ route, navigate }) => {
    const handleRetry = () => {
      // Navigate back to home or reload current route
      navigate("/");
    };

    return { handleRetry };
  },
  template: (ctx) => `
    <div class="error-boundary">
      <h1>Something went wrong</h1>
      <button @click="handleRetry">Try Again</button>
    </div>
  `,
};

app.use(ElevaRouter, {
  layout: document.getElementById("app"),
  mode: "history",
  routes: [
    { path: "/", component: HomeComponent },
    { path: "/about", component: AboutComponent },
  ],
  defaultRoute: { path: "/error", component: ErrorBoundaryComponent },
});
```

---

## Error Handling & Recovery

### Built-in Error Recovery

Eleva Router v1.1.0-alpha includes comprehensive error handling:

- **Component Mount Failures:** If a component fails to mount, the error is logged and the router continues operating
- **Route Parsing Errors:** Malformed URLs are handled gracefully with fallback to default route
- **Navigation Errors:** Failed navigation attempts are caught and logged without breaking the application
- **Event Listener Failures:** Robust event handling prevents router crashes

### Custom Error Handling

You can implement custom error handling in your components:

```js
const RobustComponent = {
  setup: ({ route, navigate }) => {
    const safeNavigate = async (path) => {
      try {
        await navigate(path);
      } catch (error) {
        console.error("Navigation failed:", error);
        // Fallback behavior
        await navigate("/");
      }
    };

    return { safeNavigate };
  },
  template: (ctx) => `
    <div>
      <button @click="safeNavigate('/risky-route')">Navigate Safely</button>
    </div>
  `,
};
```

---

## Performance & Memory Management

### Automatic Cleanup

Eleva Router automatically manages memory to prevent leaks:

- Event listeners are tracked and removed during cleanup
- Component instances are properly unmounted
- Route watchers are disposed of when components are destroyed

### Memory Leak Prevention

Best practices implemented in v1.1.0-alpha:

- **Event Listener Tracking:** All event listeners are stored and cleaned up
- **Component Lifecycle:** Proper unmounting prevents dangling references
- **State Management:** Router state is properly reset during cleanup

---

## Best Practices

1. **Always Handle Errors:** Wrap navigation calls in try-catch blocks for production applications
2. **Clean Up Resources:** Use the `destroy()` method when your application shuts down
3. **Validate Routes:** Ensure route paths are valid strings and components are properly defined
4. **Use Default Routes:** Always provide a default route for better user experience
5. **Manual Control:** Use `autoStart: false` for applications that need precise initialization timing
6. **Parameter Validation:** Validate route parameters in your components before use

```js
const UserComponent = {
  setup: ({ route, navigate }) => {
    // Validate parameters
    const userId = route.params.id;
    if (!userId || isNaN(parseInt(userId))) {
      navigate("/users"); // Redirect to user list
      return {};
    }

    return { userId };
  },
  template: (ctx) => `<div>User: ${ctx.userId}</div>`,
};
```

---

## Migration Guide

### From v1.0.x to v1.1.x

**New Features:**

- Dynamic route parameters support (`:id`, `:path*`)
- Enhanced error handling and recovery
- Memory leak prevention with automatic cleanup
- Manual router control with `autoStart` option
- Router state management with `isStarted` flag

**Breaking Changes:**

- Router now uses deferred async initialization (no breaking change for most users)
- Enhanced error handling may change error propagation behavior

**Migration Steps:**

1. **Update package version:**

   ```bash
   npm update eleva-router
   ```

2. **Add dynamic route parameters (optional):**

   ```js
   // Old static routes
   { path: "/user", component: UserComponent }

   // New dynamic routes
   { path: "/users/:id", component: UserDetailComponent }
   ```

3. **Add error handling (recommended):**

   ```js
   // Old way
   app.router.navigate("/path");

   // New way (recommended)
   try {
     await app.router.navigate("/path");
   } catch (error) {
     console.error("Navigation failed:", error);
   }
   ```

4. **Add cleanup in applications (recommended):**
   ```js
   window.addEventListener("beforeunload", async () => {
     await app.router.destroy();
   });
   ```

**No action required for most applications** - v1.1.0-alpha is designed to be backward compatible with v1.0.x-alpha usage patterns.

---

## FAQ

> **Q: What routing modes are supported?**
>
> A: You can choose between `"hash"`, `"query"`, and `"history"` modes via the plugin options.

> **Q: How do I define dynamic route parameters?**
>
> A: Use colon syntax in your route paths (e.g., `/users/:id`). For catch-all parameters, add an asterisk (e.g., `/files/:path*`).

> **Q: How do I access route parameters within a component?**
>
> A: Route parameters are available in the `route.params` object injected into your component's setup context.

> **Q: How do I define a default route?**
>
> A: Use the `defaultRoute` option in the plugin configuration to specify a fallback route if no match is found.

> **Q: How do I customize the query parameter name in query mode?**
>
> A: Use the `queryParam` option when installing the router. For example, `queryParam: "view"` will use `?view=about` instead of `?page=about`.

> **Q: Can I use different query parameters for different applications?**
>
> A: Yes, each router instance can have its own `queryParam` setting, allowing multiple routers or applications to use different parameter names.

> **Q: How do I access route information within a component?**
>
> A: Route information is injected directly into the setup context as `route`, and the `navigate` function is also provided.

> **Q: Can I add routes dynamically after initialization?**
>
> A: Yes, use the `addRoute(route)` method on the router instance to add routes dynamically.

> **Q: How do I handle errors in routing?**
>
> A: Wrap navigation calls in try-catch blocks and implement error boundaries using default routes.

> **Q: When should I use `autoStart: false`?**
>
> A: Use manual start when you need to ensure certain conditions are met before routing begins, such as user authentication or data loading.

> **Q: How do I clean up the router?**
>
> A: Call `await app.router.destroy()` to clean up event listeners and unmount components.

---

## Troubleshooting

- **No Route Matches:**
  Ensure your routes are correctly defined and that the URL exactly matches one of your route paths or patterns. Check the console for warnings about unmatched routes. If not, the `defaultRoute` (if provided) will be used.

- **Component Not Mounted:**
  Verify that the layout DOM element provided in the options exists and is valid. Ensure the component is properly defined.

- **Routing Mode Issues:**
  Double-check that the mode specified in the options is one of `"hash"`, `"query"`, or `"history"`. Check browser console for validation errors.

- **Navigation Not Working:**
  Ensure that you are calling `navigate()` correctly from the context or via `app.router.navigate()`. Check for JavaScript errors in the console.

- **Route Parameters Not Matching:**
  Make sure your route pattern follows the correct syntax (e.g., `/users/:id`) and that the URL structure matches the pattern.

- **Memory Leaks:**
  Ensure you call `app.router.destroy()` when your application shuts down. Check for duplicate router instances.

- **Router Startup Failures:**
  Check the browser console for specific error messages. Ensure the layout element exists when the router starts.

- **Hash Mode Issues:**
  In hash mode, ensure you're not manually manipulating `window.location.hash` outside of the router's navigation methods.

**Debug Mode:**
Enable verbose logging by opening browser console - Eleva Router logs important events and errors for debugging.

---

## Contribution & Support

Join our community for support, discussions, and collaboration:

- **Contribution Guidelines** [Eleva Contribution Guidelines](https://github.com/TarekRaafat/eleva-router/blob/master/CONTRIBUTING.md)
- **GitHub Discussions:** For general questions or new ideas please start a discussion on [Eleva Router Discussions](https://github.com/TarekRaafat/eleva-router/discussions)
- **GitHub Issues:** Report bugs or request features on [GitHub Issues](https://github.com/TarekRaafat/eleva-router/issues)
- **Stack Overflow:** For technical questions and support, please post your question on Stack Overflow using any of these tags [eleva](https://stackoverflow.com/questions/tagged/eleva), [elevajs](https://stackoverflow.com/questions/tagged/elevajs), [eleva.js](https://stackoverflow.com/questions/tagged/eleva.js)

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

Thank you for using **Eleva Router**! I hope this plugin makes building modern, client-side routed applications with Eleva.js a breeze. With v1.1.0's enhanced stability and new features, you can build more sophisticated routing solutions with confidence.
