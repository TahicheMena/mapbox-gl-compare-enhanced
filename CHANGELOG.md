v1.0.0
---

- **Refactored Codebase:**
  - Rewrote the `Compare` class with modern JavaScript, using ES modules and Vite for bundling.
  - Enhanced internal methods for better maintainability and performance.
  - Improved event handling with `eventemitter3` for clean and robust custom event management.
  - Simplified and modernized external dependency management.

- **Testing Overhaul:**
  - Introduced `puppeteer` for end-to-end testing of map interaction, replacing the previous testing setup.
  - Tests now ensure clipping, synchronization of zoom, pitch, bearing, and slider behavior.
  - Added comprehensive tests to validate the `remove` method, ensuring synchronization and clipping are correctly removed.

- **Improved Build Process:**
  - Migrated the build system to Vite, leveraging its speed and simplicity.
  - The library now builds in multiple formats (UMD, ESModule) for wider compatibility.
  - Excluded `mapbox-gl` from the bundle, relying on it as a peer dependency for smaller package size.

- **Breaking Changes:**
  - Requires **Node.js 22.11.0** as the minimum supported version.
  - `mapbox-gl` must be installed separately.
  - The library now requires a container element for initialization and interaction.

- **Continuous Integration Update:**
  - Removed `circle.yml` due to deprecation of the format.
  - Introduced a new `.circleci/config.yml` with updated workflows and compatibility for modern CircleCI pipelines.

- **Documentation Updates:**
  - Updated inline documentation to JSDoc for improved developer experience.
  - Added detailed examples and guidelines for library usage in modern environments.
  - Updated changelog to reflect all changes in this major release.

v0.4.0
---

- Added `remove` method [#26](https://github.com/mapbox/mapbox-gl-compare/pull/26)

v0.3.0
---

- Now accurately displays translucent styles
- :warning: BREAKING CHANGE Requires a container element to append to

v0.2.1
---

- Add `mapbox-gl` as a peer dependency

v0.2.0
---

- Added setSlider method
- Added `slideend` event listener
- Expose sliders `currentPosition`

v0.1.1
---

- Fixed offscreen bug window resize [#12](https://github.com/mapbox/mapbox-gl-compare/issues/12)
- Removed mapbox-gl package as a peer dependency [#9](https://github.com/mapbox/mapbox-gl-compare/issues/9)

v0.1.0
---

- Added compare on `mousemove` [#4](https://github.com/mapbox/mapbox-gl-compare/issues/4)

v0.0.3
---

- Eliminate dependence on mapboxgl.util

v0.0.2
---

- Use `mapbox-gl-sync-move`

v0.0.1
---

- On resize, update the setPosition of the clipped area
- Base64 encoded left to right icon for swipe control
- Update LICENCE template with proper Licence type (ISC)

v0.0.0
---

Initial commit
