# Eleva Router Documentation

**Eleva Router** is the official router plugin for Eleva.js, a minimalist, lightweight, pure vanilla JavaScript frontend runtime framework. This plugin provides flexible client-side routing functionality for Eleva.js applications. It supports three routing modes—hash, query, and history—and automatically injects route information (path, query parameters, and full URL) along with a navigation function directly into your component’s setup context.

**Version:** `v1.0.2-alpha`

> **Note:** This plugin is currently in alpha. APIs may change until a stable release.

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
  - [Usage](#usage)
    - [Basic Setup](#basic-setup)
    - [Accessing Route Information](#accessing-route-information)
    - [Programmatic Navigation](#programmatic-navigation)
  - [API Reference](#api-reference)
    - [Router Class](#router-class)
      - [Constructor](#constructor)
      - [Key Methods](#key-methods)
    - [ElevaRouter Plugin Object](#elevarouter-plugin-object)
  - [Examples](#examples)
    - [Example: Basic Hash Routing](#example-basic-hash-routing)
    - [Example: Query Routing](#example-query-routing)
    - [Example: History Routing](#example-history-routing)
  - [FAQ](#faq)
  - [Troubleshooting](#troubleshooting)
  - [Contribution \& Support](#contribution--support)
  - [License](#license)

---

## Overview

The **Eleva Router** plugin extends Eleva.js with client-side routing capabilities. It supports:

- **Hash-based Routing:** Uses URL hash (e.g., `#/pageName`) for routing.
- **Query-based Routing:** Uses URL query parameters (e.g., `?page=pageName`) where the `page` query is used as the route.
- **History-based Routing:** Uses the HTML5 History API (e.g., `/pageName`) for clean URLs.

The plugin automatically injects a `route` object and a `navigate` function into your component’s setup context so that you can easily access current route information and perform navigation programmatically.

---

## Features

- **Multiple Routing Modes:** Configure your routing strategy as "hash", "query", or "history".
- **Automatic Component Registration:** Automatically register routed components provided as definitions, reducing redundancy.
- **Route Information Injection:** The current route (path, query parameters, and full URL) is injected directly into your component’s context as `route`.
- **Programmatic Navigation:** A `navigate` function is provided in the context to change routes from within your components.
- **Default Route Fallback:** Define a default route to be used when no routes match.
- **Seamless Integration:** Built to work perfectly with Eleva.js, requiring minimal setup and configuration.

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
<script src="https://unpkg.com/eleva-router/dist/eleva-router.min.js"></script>
```

---

## Configuration Options

When installing the plugin via `app.use()`, you can pass a configuration object with the following options:

### Routing Modes

- **mode** (string): The routing mode to use. Options:
  - `"hash"` (default) – Uses `window.location.hash` (e.g., `#/pageName`).
  - `"query"` – Uses `window.location.search` and expects a query parameter named `page` (e.g., `?page=pageName`).
  - `"history"` – Uses `window.location.pathname` with the History API (e.g., `/pageName`).

### Routes

- **routes** (array): An array of route objects. Each route object can contain:
  - **path** (string): The route path (e.g., `"/"` or `"/about"`).
  - **component** (string or Object): Either a globally registered component name or a component definition.
  - **props** (object, optional): Additional props to pass to the routed component.

### Default Route

- **defaultRoute** (object, optional): A route object to be used as a fallback when no other route matches. It has the same structure as the other route objects.

---

## Usage

### Basic Setup

Below is an example of setting up Eleva Router with Eleva.js:

```js
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
  container: document.getElementById("app"),
  mode: "history", // Can be "hash", "query", or "history"
  routes: [
    { path: "/", component: HomeComponent },
    { path: "/about", component: AboutComponent },
  ],
  defaultRoute: { path: "/404", component: NotFoundComponent },
});

// Programmatically navigate from outside a component:
app.router.navigate("/about");
```

### Accessing Route Information

Within any routed component, route information is injected directly into the setup context as `route`. For example:

```js
const MyComponent = {
  setup: ({ route, navigate }) => {
    console.log("Current path:", route.path);
    console.log("Query parameters:", route.query);
    console.log("Full URL:", route.fullUrl);
    // You can also navigate programmatically:
    // navigate("/about");
    return {};
  },
  template: (ctx) => `<div>Content here</div>`,
};
```

### Programmatic Navigation

From within a component or externally, you can navigate by calling the `navigate` function:

- **Within a component:** Access via the setup context:
  ```js
  // Example inside a component's setup:
  navigate("/about");
  ```
- **From outside:** Use the router instance:
  ```js
  app.router.navigate("/about");
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
  - `container`: (HTMLElement) Where routed components will be mounted.
  - `mode`: (string) "hash" (default), "query", or "history".
  - `routes`: (array) Array of route objects.
  - `defaultRoute`: (object, optional) A fallback route object.

#### Key Methods

- **start():**
  Starts the router by listening for route changes and processing the initial route.

- **routeChanged():**
  Called on URL changes; extracts the current path and query parameters, and mounts the corresponding component.

- **navigate(path):**
  Programmatically navigates to a given path.

- **addRoute(route):**
  Dynamically adds a new route.

- **wrapComponentWithRoute(comp, routeInfo):**
  Wraps a component definition so that its setup function receives the `route` and `navigate` properties directly.

### ElevaRouter Plugin Object

- **install(eleva, options):**
  Installs the router plugin into an Eleva.js instance. Automatically registers routed components (if provided as definitions), attaches the Router instance to `eleva.router`, and starts the router.

---

## Examples

### Example: Basic Hash Routing

```js
app.use(ElevaRouter, {
  container: document.getElementById("app"),
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
app.use(ElevaRouter, {
  container: document.getElementById("app"),
  mode: "query",
  routes: [
    { path: "/", component: HomeComponent },
    { path: "/services", component: ServicesComponent },
  ],
});
```

### Example: History Routing

```js
app.use(ElevaRouter, {
  container: document.getElementById("app"),
  mode: "history",
  routes: [
    { path: "/", component: HomeComponent },
    { path: "/about", component: AboutComponent },
  ],
});
```

---

## FAQ

> **Q: What routing modes are supported?**
>
> A: You can choose between `"hash"`, `"query"`, and `"history"` modes via the plugin options.

> **Q: How do I define a default route?**
>
> A: Use the `defaultRoute` option in the plugin configuration to specify a fallback route if no match is found.

> **Q: How do I access route information within a component?**
>
> A: Route information is injected directly into the setup context as `route`, and the `navigate` function is also provided.

> **Q: Can I add routes dynamically after initialization?**
>
> A: Yes, use the `addRoute(route)` method on the router instance to add routes dynamically.

---

## Troubleshooting

- **No Route Matches:**
  Ensure your routes are correctly defined and that the URL exactly matches one of your route paths. If not, the `defaultRoute` (if provided) will be used.

- **Component Not Mounted:**
  Verify that the container DOM element provided in the options exists and is valid.

- **Routing Mode Issues:**
  Double-check that the mode specified in the options is one of `"hash"`, `"query"`, or `"history"`.

- **Navigation Not Working:**
  Ensure that you are calling `navigate()` correctly from the context or via `app.router.navigate()`.

---

## Contribution & Support

Join our community for support, discussions, and collaboration:

- **Contribution Guidelines** [Eleva Contribution Guidelines](https://github.com/TarekRaafat/eleva-router/blob/master/CONTRIBUTING.md)
- **GitHub Discussions:** For general questions or new ideas please start a discussion on [Eleva Router Discussions](https://github.com/TarekRaafat/eleva-router/discussions)
- **GitHub Issues:** Report bugs or request features on [GitHub Issues](https://github.com/TarekRaafat/eleva-router/issues)
- **Stack Overflow:** For technical questions and support, please post your question on Stack Overflow using any of these tags [eleva](https://stackoverflow.com/questions/tagged/eleva), [eleva.js](https://stackoverflow.com/questions/tagged/eleva.js)

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

Thank you for using **Eleva Router**! I hope this plugin makes building modern, client-side routed applications with Eleva.js a breeze.
