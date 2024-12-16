import { defineConfig } from 'vite';

/**
 * Vite configuration file for building the Compare library.
 * 
 * This configuration is optimized for creating a library bundle
 * compatible with external dependencies like `mapbox-gl`.
 * 
 * @see https://vitejs.dev/guide/build.html#library-mode
 */
export default defineConfig({
  build: {
    /**
     * Library build settings.
     * 
     * - `entry`: The entry point of the library (main source file).
     * - `name`: The global variable name used in UMD/IIFE builds.
     * - `fileName`: The naming convention for the output files.
     */
    lib: {
      entry: 'src/index.js', // Path to the main file of the library
      name: 'Compare', // Global variable name for UMD/IIFE builds
      fileName: 'mapbox-gl-compare-enhanced', // Output file name
      //fileName: (format) => `mapbox-gl-compare-enhanced.${format}.js`, // Output file naming pattern
    },
    /**
     * Rollup options for advanced customization of the build process.
     * 
     * - `external`: Specifies dependencies that should not be bundled
     *   and instead referenced as external dependencies.
     * - `output.globals`: Maps external dependencies to their global variables
     *   in UMD/IIFE builds.
     */
    rollupOptions: {
      external: ['mapbox-gl'], // Exclude `mapbox-gl` from the bundle
      output: {
        globals: {
          'mapbox-gl': 'mapboxgl', // Global variable mapping for `mapbox-gl`
        },
      },
    },
  },
});
