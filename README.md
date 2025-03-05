# Eleva Router

**Eleva Router** is the official router plugin for Eleva.js, a minimalist, lightweight, pure vanilla JavaScript frontend runtime framework. This plugin adds flexible client-side routing capabilities to your Eleva.js applications by supporting multiple routing modes and by seamlessly integrating route information into your components.

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/npm/v/eleva-router.svg?style=flat)](https://www.npmjs.com/package/eleva-router)
[![Minified Size](https://badgen.net/bundlephobia/min/eleva-router)](https://bundlephobia.com/package/eleva-router)
[![Gzipped Size](https://badgen.net/bundlephobia/minzip/eleva-router)](https://bundlephobia.com/package/eleva-router)

> **Status:** v1.0.3-alpha – This is an early alpha release. APIs may change until a stable release is announced.

---

## Table of Contents

- [Eleva Router](#eleva-router)
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
    - [Accessing Route Data](#accessing-route-data)
    - [Programmatic Navigation](#programmatic-navigation)
  - [API Reference](#api-reference)
    - [Router Class](#router-class)
      - [Constructor](#constructor)
      - [Key Methods](#key-methods)
    - [ElevaRouter Plugin Object](#elevarouter-plugin-object)
  - [Examples](#examples)
    - [Example: Basic History Routing](#example-basic-history-routing)
    - [Example: Query Routing](#example-query-routing)
    - [Example: Hash Routing](#example-hash-routing)
  - [FAQ](#faq)
  - [Troubleshooting](#troubleshooting)
  - [Contribution \& Support](#contribution--support)
  - [License](#license)

---

## Overview

**Eleva Router** extends Eleva.js with robust client-side routing functionality. It supports three routing modes:

- **Hash-based Routing:** Uses URL hash (e.g. `#/pageName`).
- **Query-based Routing:** Uses URL query parameters (e.g. `?page=pageName`).
- **History-based Routing:** Uses the History API for clean URLs (e.g. `/pageName`).

The plugin automatically injects the current route information—such as path, query parameters, and full URL—directly into your component’s setup context as `route`. In addition, a `navigate` function is provided in the context so you can programmatically change routes from within your components.

---

## Features

- **Multiple Routing Modes:** Configure your routing strategy as `"hash"`, `"query"`, or `"history"`.
- **Automatic Component Registration:** If you provide routed components as definitions, the plugin automatically registers them with Eleva.js.
- **Route Data Injection:** The current route information is injected directly into the setup context as `route`.
- **Built-in Navigation:** Access a `navigate` function within components to perform programmatic routing.
- **Default Route Fallback:** Specify a `defaultRoute` that will be used if no route matches the current URL.
- **Seamless Eleva.js Integration:** Designed to work out of the box with Eleva.js.

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

- **mode** (string): The routing mode. Options:
  - `"hash"` (default) – Uses `window.location.hash` (e.g. `#/pageName`).
  - `"query"` – Uses `window.location.search` and expects a `page` query parameter (e.g. `?page=pageName`).
  - `"history"` – Uses `window.location.pathname` with the History API (e.g. `/pageName`).

### Routes

- **routes** (array): An array of route objects. Each route object should include:
  - **path** (string): The URL path (e.g. `"/"` or `"/about"`).
  - **component** (string or object): A globally registered component name or a component definition.
  - **props** (object, optional): Additional props to pass to the routed component.

### Default Route

- **defaultRoute** (object, optional): A route object to be used as a fallback when no matching route is found. It has the same structure as a route object.

---

## Usage

### Basic Setup

Below is an example of how to set up **Eleva Router** with Eleva.js:

```js
import Eleva from "eleva";
import ElevaRouter from "eleva-router";

const app = new Eleva("MyApp");

// Define routed components directly (no separate registration required)
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

// Install the router plugin with configuration options.
app.use(ElevaRouter, {
  container: document.getElementById("app"),
  mode: "history", // Options: "hash", "query", or "history"
  routes: [
    { path: "/", component: HomeComponent },
    { path: "/about", component: AboutComponent },
  ],
  defaultRoute: { path: "/404", component: NotFoundComponent },
});
```

### Accessing Route Data

Within any routed component, the plugin injects a `route` object directly into the setup context. For example:

```js
const MyComponent = {
  setup: ({ route, navigate }) => {
    console.log("Current path:", route.path);
    console.log("Query parameters:", route.query);
    console.log("Full URL:", route.fullUrl);
    // Navigate programmatically if needed:
    // navigate("/about");
    return {};
  },
  template: (ctx) => `<div>Content here</div>`,
};
```

### Programmatic Navigation

- **Within a Component:**  
  Use the `navigate` function provided in the context:
  ```js
  navigate("/about");
  ```
- **From Outside:**  
  Call the router’s `navigate` method:
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
- **options:** An object containing:
  - `container` (HTMLElement): The element where routed components are mounted.
  - `mode` (string): `"hash"`, `"query"`, or `"history"`.
  - `routes` (array): Array of route objects.
  - `defaultRoute` (object, optional): A fallback route.

#### Key Methods

- **start()**  
  Starts the router by listening to URL changes and resolving the initial route.

- **routeChanged()**  
  Extracts route details from the URL (based on the routing mode), parses query parameters, and mounts the corresponding component.

- **navigate(path)**  
  Programmatically navigates to the specified route, updating the URL accordingly.

- **addRoute(route)**  
  Dynamically adds a new route to the router.

- **wrapComponentWithRoute(comp, routeInfo)**  
  Wraps a component’s setup function to inject route data and a navigation function directly into the context.

### ElevaRouter Plugin Object

- **install(eleva, options)**  
  Installs the router plugin, automatically registers routed components (if provided as objects), attaches a Router instance to `eleva.router`, and starts the router.

For further details on API usage, please refer to the [full API documentation](docs/index.md).

---

## Examples

### Example: Basic History Routing

```js
app.use(ElevaRouter, {
  container: document.getElementById("app"),
  mode: "history",
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

### Example: Hash Routing

```js
app.use(ElevaRouter, {
  container: document.getElementById("app"),
  mode: "hash",
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
> A: The `route` object is injected directly into the setup context, and a `navigate` function is also provided.

> **Q: Can I add routes dynamically after initialization?**
>
> A: Yes, use the `addRoute(route)` method on the router instance.

---

## Troubleshooting

- **No Route Matches:**  
  Verify that the URL matches one of your defined routes. If not, the `defaultRoute` (if provided) will be used.

- **Component Not Mounted:**  
  Check that the container element provided in the configuration exists and is valid.

- **Routing Mode Issues:**  
  Ensure the `mode` option is set to one of `"hash"`, `"query"`, or `"history"`.

- **Navigation Not Working:**  
  Confirm that you are calling the `navigate()` function correctly from either the component context or via `app.router.navigate()`.

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
