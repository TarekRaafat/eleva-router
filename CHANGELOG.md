# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## v1.0.3-alpha ✨ - (06-03-2025)

### ➕ Added

- _N/A_ – No additions in this release.

### 🎛️ Changed

- _N/A_ – No changes in this release.

### 🔧 Fixed

- **Hash Mode Navigation:**
  - Fixed an issue where calling `navigate("/")` in hash mode did not update the view. The router now uses `history.replaceState` to remove the hash from the URL and properly re-renders the home route.
- **Query Mode Navigation:**
  - Corrected behavior so that navigating to the home route in query mode removes the `page` parameter instead of setting it to `%2F`.
  - Improved handling of URLs so that both `?page=about` and `/ ?page=about` correctly navigate to the "about" route.
- **Container Clearing:**
  - Added container clearing before mounting a new component to ensure that the previous view is fully removed.
- **Path Normalization:**
  - Improved normalization so that paths without a leading slash are automatically prefixed with `/`, ensuring consistent route matching.
- **General Improvements:**
  - Ensured that the routing container is cleared before mounting a new component to avoid residual content.
  - Improved injection of the `route` object and the `navigate` function directly into the component’s setup context, ensuring they are accessible and correctly bound.
- **Route Change Trigger:**
  - Updated the `navigate` method to explicitly call `this.routeChanged()` after updating the URL to ensure the view updates immediately.

---

## v1.0.2-alpha - (04-03-2025)

### ➕ Added

- _N/A_ – No additions in this release.

### 🎛️ Changed

- _N/A_ – No changes in this release.

### 🔧 Fixed

- **Build ESM and UMD Files:**
  - Fixed the build files inner name and version.

---

## v1.0.1-alpha - (04-03-2025)

### ➕ Added

- _N/A_ – No additions in this release.

### 🎛️ Changed

- _N/A_ – No changes in this release.

### 🔧 Fixed

- **README, DOCS, and Examples:**
  - Fixed the `jsDelivr` CDN URLs.

---

## v1.0.0-alpha - (04-03-2025)

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
