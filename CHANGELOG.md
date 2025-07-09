# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## v1.2.0-alpha ✨ - (09-07-2025)

### ➕ Added

- **Custom View Selector Support:**
  - Added `viewSelector` option to allow users to define their own view element selectors.
  - Implemented dynamic view element selection using customizable selector names (e.g., `#custom`, `.custom`, `<custom>`, or `data-custom`).
  - Enhanced flexibility for view element identification within app layouts.

### 🎛️ Changed

- **Architectural Refactoring - Layout and View Separation:**
  - **Breaking Change:** Replaced single `container` concept with dual `layout` and `view` architecture for better separation of concerns.
  - **Layout Element:** The `options.layout` now represents the main app container where the router searches for view elements.
  - **View Element:** Router automatically detects view elements within the layout using priority-based selection: `#view` → `.view` → `<view>` → `data-view`.
  - **Fallback Mechanism:** If no view element is found, the layout element itself becomes the mounting target.
  - **Enhanced Usability:** This change provides clearer structure for app layouts and better control over where routed components are mounted.
- **View Element Selection Logic:**
  - Implemented intelligent view element detection that searches within the layout container.
  - Added micro-optimized priority system for view element selection (fastest to slowest: ID → class → tag → data attribute).
  - Enhanced component mounting to use the detected view element instead of the entire layout.

### 🔧 Fixed

- **Documentation and Examples:**
  - Updated README and documentation to reflect the new layout/view architecture.
  - Enhanced configuration examples to demonstrate proper layout and view element setup.
  - Improved clarity on view element selection and customization options.

### ⚠️ BREAKING CHANGES

- **Router Configuration:**
  - **`options.container` → `options.layout`:** The router now requires a `layout` option instead of `container`. This represents a fundamental change in how the router understands app structure.
  - **Automatic View Detection:** The router now automatically searches for view elements within the layout, changing the mounting behavior from direct container mounting to intelligent view element detection.
  - **Backward Compatibility:** Existing code using `options.container` will need to be updated to use `options.layout` and may need to add appropriate view elements to their HTML structure.

---

## v1.1.0-alpha - (03-06-2025)

### ➕ Added

- **Dynamic Route Parameters:**
  - Added support for dynamic route parameters (e.g. "/users/:id") which are passed to components via `route.params`.
  - Implemented parameter extraction and matching for dynamic segments in routes.
  - Added support for catch-all parameters (e.g. ":path\*") for flexible route matching.
- **Enhanced Error Handling:**
  - Added comprehensive error handling throughout the router with detailed error messages.
  - Implemented graceful error recovery for route matching and component mounting.
- **Router Lifecycle Management:**
  - Added `destroy()` method to properly clean up router resources and event listeners.
  - Implemented router state tracking with `isStarted` flag.
  - Added support for manual router start with `autoStart` option.
- **Query Parameter Customization:**
  - Added `queryParam` option to customize the query parameter name used for routing.

### 🎛️ Changed

- **Router Initialization:**
  - Made router initialization asynchronous with proper error handling.
  - Improved component registration process with better error handling.
- **Route Matching:**
  - Completely revamped route matching system to support dynamic parameters.
  - Added path segment parsing for more efficient route matching.
  - Improved handling of root path ("/") in route matching.
- **Navigation:**
  - Enhanced `navigate` method to support parameter injection into paths.
  - Improved URL handling across all routing modes.
  - Added proper error handling for navigation operations.
- **Component Wrapping:**
  - Enhanced component wrapping to include route parameters in the context.
  - Improved error handling during component mounting and unmounting.

### 🔧 Fixed

- **Event Listener Management:**
  - Fixed potential memory leaks by properly tracking and cleaning up event listeners.
- **Component Cleanup:**
  - Improved component cleanup by properly unmounting previous components before mounting new ones.
- **Path Handling:**
  - Fixed path normalization and validation across all routing modes.
  - Improved handling of empty paths and root path in all routing modes.

### ⚠️ BREAKING CHANGES

- **Router Initialization:**
  - The `start()` method is now asynchronous and returns a Promise. Any code that calls `router.start()` must be updated to use `await` or handle the Promise.
  - The router no longer automatically starts by default. Use the `autoStart: true` option to maintain the previous behavior.
- **Component Registration:**
  - The router now uses `eleva._components.get()` instead of direct property access for component lookup. This may affect custom component registration systems.
- **Route Matching:**
  - The `matchRoute()` method now returns `null` instead of `undefined` when no route is found.
  - Route matching is now case-sensitive by default for better security and predictability.
- **Navigation:**
  - The `navigate()` method is now asynchronous and returns a Promise. All navigation calls must be updated to use `await` or handle the Promise.
  - The `navigate()` method now requires proper error handling as it may throw errors in invalid cases.

---

## v1.0.5-alpha - (08-03-2025)

### ➕ Added

- _N/A_ – No additions in this release.

### 🎛️ Changed

- _N/A_ – No changes in this release.

### 🔧 Fixed

- **Child Component Route Access:**
  - Fixed an issue where child components couldn't access route information (`path`, `navigate`, etc.) from their setup context.
  - Enhanced the `wrapComponentWithRoute` method to recursively wrap child components, ensuring route data propagates through the component tree.

---

## v1.0.4-alpha - (06-03-2025)

### ➕ Added

- _N/A_ – No additions in this release.

### 🎛️ Changed

- _N/A_ – No changes in this release.

### 🔧 Fixed

- **Library Build**
  - Fixed the library build to the current version.

---

## v1.0.3-alpha - (06-03-2025)

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
  - Improved injection of the `route` object and the `navigate` function directly into the component's setup context, ensuring they are accessible and correctly bound.
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
  - Automatic injection of route information (current path, query parameters, and full URL) directly into the component's setup context as `route`.
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
