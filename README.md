# mapbox-gl-compare-enhanced

Enhanced version of Mapbox GL Compare: Swipe and sync between two maps with improved compatibility for modern environments (Node.js, Vite, etc.)

![Swipe example](http://i.imgur.com/MvjwVLu.gif)

Map movements are synced with [mapbox-gl-sync-move](https://github.com/mapbox/mapbox-gl-sync-move).

## Usage

```js
import 'mapbox-gl-compare-enhanced/dist/style.css'
import Compare from 'mapbox-gl-compare-enhanced'

const before = new mapboxgl.Map({
  container: 'before', // Container ID
  style: 'mapbox://styles/mapbox/light-v9'
});

const after = new mapboxgl.Map({
  container: 'after', // Container ID
  style: 'mapbox://styles/mapbox/dark-v9'
});

// A selector or reference to HTML element
const container = '#comparison-container';

new Compare(before, after, container, {
  mousemove: true, // Optional. Set to true to enable swiping during cursor movement.
  orientation: 'vertical' // Optional. Sets the orientation of swiper to horizontal or vertical, defaults to vertical
});
```

## Methods

```js
const compare = new Compare(before, after, container, {
  mousemove: true, // Optional. Set to true to enable swiping during cursor movement.
  orientation: 'vertical' // Optional. Sets the orientation of swiper to horizontal or vertical, defaults to vertical
});

// Get Current position - this will return the slider's current position, in pixels
console.log(compare.currentPosition);

// Set Position - this will set the slider at the specified (x) number of pixels from the left-edge or top-edge of viewport based on swiper orientation
compare.setSlider(x);

// Listen to slider movement - and return current position on each slideend
compare.on('slideend', (e) => {
  console.log(e.currentPosition);
});

// Remove - this will remove the compare control from the DOM and stop synchronizing the two maps
compare.remove();
```

Demo: <https://www.mapbox.com/mapbox-gl-js/example/mapbox-gl-compare/>

See [API.md](https://github.com/mapbox/mapbox-gl-compare/blob/main/API.md) for a complete reference.

## Developing

Install dependencies, start the development server, and open your browser:

```bash
npm install
npm start
open http://localhost:9966
```

You'll need a [Mapbox access token](https://www.mapbox.com/help/create-api-access-token/) stored in localStorage. Set it via:

```javascript
localStorage.setItem('MapboxAccessToken', '<TOKEN HERE>');
```

## Testing

Tests now utilize `puppeteer` for end-to-end testing. Ensure you have a valid `MapboxAccessToken` environment variable set:

```bash
export MapboxAccessToken="YOUR_ACCESS_TOKEN"
```

Run the tests:

```bash
npm test
```

## Deploying

### npm registry

To deploy to npm, follow these steps:

1. Build the library:

   ```bash
   npm run build
   ```

2. Update the `version` key in [package.json](https://github.com/mapbox/mapbox-gl-compare/blob/main/package.json).

3. Update the [CHANGELOG.md](https://github.com/mapbox/mapbox-gl-compare/blob/main/CHANGELOG.md).

4. Commit and push your changes:

   ```bash
   git commit -am "Release vX.X.X"
   git push
   ```

5. Tag the release:

   ```bash
   git tag -a vX.X.X -m 'vX.X.X'
   git push --tags
   ```

6. Publish to npm:

   ```bash
   npm publish
   ```

7. Update the version number in the [GL JS example](https://github.com/mapbox/mapbox-gl-js-docs/blob/publisher-production/docs/pages/example/mapbox-gl-compare.html).

### mapbox cdn

Deploy the library to Mapbox's CDN:

```bash
aws s3 cp --acl public-read ./dist/mapbox-gl-compare.js s3://mapbox-gl-js/plugins/mapbox-gl-compare/v$(node --print --eval "require('./package.json').version")/mapbox-gl-compare.js
aws s3 cp --acl public-read ./dist/mapbox-gl-compare.css s3://mapbox-gl-js/plugins/mapbox-gl-compare/v$(node --print --eval "require('./package.json').version")/mapbox-gl-compare.css
```

---

### Updated Features in v1.0.0

- **Refactored Codebase:**
  - Migrated to ES modules and modern JavaScript practices.
  - Introduced Vite for faster and simpler builds.
  - Externalized `mapbox-gl` as a peer dependency for reduced package size.

- **Enhanced Testing:**
  - Switched to `puppeteer` for robust end-to-end testing.
  - Comprehensive coverage for synchronization, slider movements, and clipping removal.

- **Documentation Updates:**
  - Replaced inline comments with JSDoc.
  - Improved examples and guidelines in the API documentation.

- **Breaking Changes:**
  - Requires Node.js version 22.11.0.
  - Removed deprecated `circle.yml` and replaced it with `config.yml`.
