# Eleva Router

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/tarekraafat/eleva-router?label=github)](https://github.com/TarekRaafat/eleva-router)
[![Version](https://img.shields.io/npm/v/eleva-router.svg?style=flat)](https://www.npmjs.com/package/eleva-router)
![100% Javascript](https://img.shields.io/github/languages/top/TarekRaafat/eleva-router?color=yellow)
![Zero Dependencies](https://img.shields.io/badge/dependencies-0-green.svg)
[![Minified Size](https://badgen.net/bundlephobia/min/eleva-router)](https://bundlephobia.com/package/eleva-router)
[![Gzipped Size](https://badgen.net/bundlephobia/minzip/eleva-router)](https://bundlephobia.com/package/eleva-router)

The official router plugin for **Eleva.js** - a lightweight, zero-dependency client-side routing solution with support for hash, query, and history modes.

> **Latest:** v1.1.0-alpha with dynamic route parameters, enhanced error handling, and memory management.

## ✨ Features

- 🚀 **Multiple routing modes**: Hash (`#/page`), Query (`?page=name`), History (`/page`)
- 🎯 **Dynamic route parameters**: `/users/:id`, `/files/:path*` (catch-all)
- 🔧 **Zero configuration**: Works out of the box with sensible defaults
- 💾 **Memory efficient**: Automatic cleanup and leak prevention
- 🛡️ **Error resilient**: Built-in error handling and recovery
- 📦 **Tiny footprint**: Zero dependencies, minimal bundle size

## 🚀 Quick Start

### Installation

```bash
npm install eleva-router
```

### Basic Usage

```js
import Eleva from "eleva";
import ElevaRouter from "eleva-router";

const app = new Eleva("MyApp");

// Define components
const Home = {
  template: () => `<h1>Welcome Home!</h1>`,
};

const About = {
  setup: ({ navigate }) => ({
    goHome: () => navigate("/"),
  }),
  template: (ctx) => `
    <div>
      <h1>About Us</h1>
      <button @click="goHome">Go Home</button>
    </div>
  `,
};

// Setup router
app.use(ElevaRouter, {
  container: document.getElementById("app"),
  mode: "history", // "hash" | "query" | "history"
  routes: [
    { path: "/", component: Home },
    { path: "/about", component: About },
  ],
});
```

## 🎯 Dynamic Routes

```js
// Route with parameters
{ path: "/users/:id", component: UserProfile }

// Catch-all route
{ path: "/files/:path*", component: FileViewer }

// Access parameters in component
const UserProfile = {
  setup: ({ route }) => ({
    userId: route.params.id // "123" for "/users/123"
  }),
  template: (ctx) => `<h1>User: ${ctx.userId}</h1>`
};
```

## 🔧 Configuration

| Option         | Type        | Default      | Description                                                          |
| -------------- | ----------- | ------------ | -------------------------------------------------------------------- |
| `container`    | HTMLElement | **required** | DOM element where components mount                                   |
| `mode`         | string      | `"hash"`     | Routing mode: `"hash"`, `"query"`, or `"history"`                    |
| `queryParam`   | string      | `"page"`     | Query parameter name for query mode (`?page=about` vs `?view=about`) |
| `routes`       | array       | `[]`         | Array of route objects                                               |
| `defaultRoute` | object      | `null`       | Fallback route for unmatched paths                                   |
| `autoStart`    | boolean     | `true`       | Auto-start router after installation                                 |

## 📱 Navigation

### From Components

```js
const MyComponent = {
  setup: ({ navigate, route }) => ({
    // Simple navigation
    goToAbout: () => navigate("/about"),

    // With parameters
    goToUser: (id) => navigate("/users/:id", { id }),

    // Current route info
    currentPath: route.path,
    routeParams: route.params,
    queryParams: route.query,
  }),
};
```

### Programmatically

```js
// Navigate from anywhere
await app.router.navigate("/about");
await app.router.navigate("/users/:id", { id: 123 });

// Router control
await app.router.start(); // Manual start
await app.router.destroy(); // Cleanup
```

## 🛠️ Routing Modes

### Hash Mode (Default)

```js
// URLs: http://example.com/#/about
app.use(ElevaRouter, { mode: "hash", ... });
```

### History Mode

```js
// URLs: http://example.com/about
app.use(ElevaRouter, { mode: "history", ... });
```

### Query Mode

```js
// Default: ?page=about
app.use(ElevaRouter, { mode: "query", ... });

// Custom: ?view=about
app.use(ElevaRouter, {
  mode: "query",
  queryParam: "view",
  ...
});
```

## 🔍 Examples

<details>
<summary><strong>Query Mode Customization</strong></summary>

```js
// E-commerce with custom parameter
app.use(ElevaRouter, {
  container: document.getElementById("app"),
  mode: "query",
  queryParam: "category", // ?category=electronics
  routes: [
    { path: "/", component: Home },
    { path: "/electronics", component: Electronics },
    { path: "/books", component: Books },
  ],
});

// Admin panel
app.use(ElevaRouter, {
  container: document.getElementById("app"),
  mode: "query",
  queryParam: "section", // ?section=users
  routes: [
    { path: "/", component: Dashboard },
    { path: "/users", component: UserManagement },
    { path: "/settings", component: Settings },
  ],
});
```

</details>

<details>
<summary><strong>Complete App Example</strong></summary>

```js
import Eleva from "eleva";
import ElevaRouter from "eleva-router";

const app = new Eleva("BlogApp");

const routes = [
  {
    path: "/",
    component: {
      template: () => `<h1>Blog Home</h1>`,
    },
  },
  {
    path: "/posts/:id",
    component: {
      setup: ({ route, navigate }) => ({
        postId: route.params.id,
        goHome: () => navigate("/"),
      }),
      template: (ctx) => `
        <article>
          <h1>Post #${ctx.postId}</h1>
          <button @click="goHome">← Back</button>
        </article>
      `,
    },
  },
  {
    path: "/category/:name",
    component: {
      setup: ({ route }) => ({
        category: route.params.name,
      }),
      template: (ctx) => `<h1>Category: ${ctx.category}</h1>`,
    },
  },
];

app.use(ElevaRouter, {
  container: document.getElementById("app"),
  mode: "history",
  routes,
  defaultRoute: {
    path: "/404",
    component: {
      template: () => `<h1>Page Not Found</h1>`,
    },
  },
});
```

</details>

<details>
<summary><strong>Manual Router Control</strong></summary>

```js
app.use(ElevaRouter, {
  container: document.getElementById("app"),
  routes: [...],
  autoStart: false // Don't start automatically
});

// Start when ready
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await app.router.start();
    console.log("Router started!");
  } catch (error) {
    console.error("Router failed:", error);
  }
});

// Cleanup on exit
window.addEventListener("beforeunload", () => {
  app.router.destroy();
});
```

</details>

## 📚 Documentation

For comprehensive documentation, advanced features, and best practices:

**📖 [Full Documentation](docs/index.md)**

- Complete API reference
- Advanced routing patterns
- Error handling strategies
- Performance optimization
- Migration guides

## 🐛 Troubleshooting

**Common Issues:**

- **Routes not matching**: Check path syntax and ensure container exists
- **Components not mounting**: Verify component definitions and container element
- **Navigation not working**: Use `navigate()` from context or `app.router.navigate()`
- **Memory issues**: Call `app.router.destroy()` during cleanup

**Need Help?**

- 💬 [GitHub Discussions](https://github.com/TarekRaafat/eleva-router/discussions)
- 🐛 [Report Issues](https://github.com/TarekRaafat/eleva-router/issues)
- 📚 [Full Documentation](docs/index.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

[MIT License](LICENSE) - feel free to use in any project.

---

**Made with 🖤 for the Eleva.js ecosystem**
