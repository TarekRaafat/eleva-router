# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## v1.0.0-alpha ✨ - (04-03-2025)

### ➕ Added

- **Initial Release of @eleva/router**
  - A router plugin for Eleva.js that supports multiple routing modes:
    - **Hash-based routing:** Uses `window.location.hash` (e.g. `#/pageName`).
    - **Query-based routing:** Uses URL query parameters (e.g. `?page=pageName`).
    - **History-based routing:** Uses `window.location.pathname` with the History API (e.g. `/pageName`).
  - Automatic injection of route information (current path, query parameters, and full URL) directly into the component’s setup context as `route`.
  - Exposure of a `navigate` function in the setup context for programmatic navigation.
  - Support for a `defaultRoute` option to specify a fallback route when no route matches.
  - Automatic registration of routed components when provided as definitions to avoid redundant calls to `app.component()`.
  - Comprehensive inline documentation and detailed JSDoc comments for better maintainability and clarity.

### 🎛️ Changed

- **Routing Context Enhancement:**
  - The mounting context now includes both the route information and a navigation function, making it easier to manage routing directly within components.

### 🔧 Fixed

- _N/A_ – This is the initial alpha release.

---

_This is a pre-release version of Eleva Router. Future releases will document further improvements, bug fixes, and new features as the library evolves._
