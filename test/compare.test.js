import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import puppeteer from 'puppeteer';

let browser, page;

/**
 * Set up the Puppeteer browser and page before running tests.
 * 
 * @returns {Promise<void>}
 */
beforeAll(async () => {
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
});

/**
 * Close the Puppeteer browser after all tests are completed.
 * 
 * @returns {Promise<void>}
 */
afterAll(async () => {
  await browser.close();
});

/**
 * Test suite for the Compare class.
 */
describe('Compare', () => {
  /**
   * Test if Map A and Map B are clipped after the Compare slider is initialized.
   * Also tests if the maps remain synchronized when moving the slider.
   */
  it('should clip Map A and Map B after initialization', async () => {
    await page.setViewport({ width: 800, height: 600 });

    // Load a simple HTML structure with containers for the maps
    await page.setContent(`
      <div id="mapA" style="width: 400px; height: 600px;"></div>
      <div id="mapB" style="width: 400px; height: 600px;"></div>
      <div id="compare"></div>
    `);

    // Inject Mapbox GL JS and the Compare bundle into the page
    await page.addScriptTag({ path: 'node_modules/mapbox-gl/dist/mapbox-gl.js' });
    await page.addScriptTag({ path: 'dist/mapbox-gl-compare-enhanced.umd.js' });

    const result = await page.evaluate(() => {
      // Initialize Map A and Map B
      const mapA = new mapboxgl.Map({
        container: 'mapA',
        zoom: 1,
        center: [0, 0],
        testMode: true,
        style: {
          version: 8,
          sources: {
            land: { type: 'geojson', data: '/fixtures/land.json' },
          },
          layers: [
            {
              id: 'land',
              type: 'fill',
              source: 'land',
              paint: { 'fill-color': '#f0e9e1' },
            },
          ],
        },
      });

      const mapB = new mapboxgl.Map({
        container: 'mapB',
        zoom: 1,
        center: [0, 0],
        testMode: true,
        style: {
          version: 8,
          sources: {
            land: { type: 'geojson', data: '/fixtures/land.json' },
          },
          layers: [
            {
              id: 'land',
              type: 'fill',
              source: 'land',
              paint: { 'fill-color': '#f0e9e1' },
            },
          ],
        },
      });

      // Initialize Compare slider
      const container = document.getElementById('compare');
      const compare = new Compare(mapA, mapB, container);

      // Verify initial clipping
      const clipA = mapA.getContainer().style.clip;
      const clipB = mapB.getContainer().style.clip;

      // Synchronize maps and move the slider
      mapB.jumpTo({
        bearing: 20,
        center: { lat: 16, lng: -155 },
        pitch: 20,
        zoom: 3,
      });

      compare.setSlider(20);

      const syncResults = {
        zoom: mapA.getZoom(),
        pitch: mapA.getPitch(),
        bearing: mapA.getBearing(),
        center: mapA.getCenter(),
        sliderPosition: compare.currentPosition,
      };

      // Remove the Compare slider
      compare.remove();

      return {
        clipA,
        clipB,
        syncResults,
        isClippedAfterRemove: {
          clipA: mapA.getContainer().style.clip,
          clipB: mapB.getContainer().style.clip,
        },
      };
    });

    // Assert initial clipping is applied
    expect(result.clipA).not.toBe('');
    expect(result.clipB).not.toBe('');

    // Assert maps are synchronized
    expect(result.syncResults.zoom).toBe(3);
    expect(result.syncResults.pitch).toBe(20);
    expect(result.syncResults.bearing).toBe(20);
    expect(result.syncResults.center.lng).toBe(-155);
    expect(result.syncResults.center.lat).toBe(16);

    // Assert the slider position
    expect(result.syncResults.sliderPosition).toBe(20);

    // Assert clipping is removed after Compare slider is removed
    expect(result.isClippedAfterRemove.clipA).toBe('');
    expect(result.isClippedAfterRemove.clipB).toBe('');
  });

  /**
   * Test if Map A and Map B are no longer synchronized after the Compare slider is removed.
   */
  it('should not sync Map A and Map B after removal', async () => {
    const result = await page.evaluate(() => {
      // Initialize Map A and Map B
      const mapA = new mapboxgl.Map({
        container: 'mapA',
        zoom: 1,
        center: [0, 0],
        testMode: true,
        style: {
          version: 8,
          sources: {
            land: { type: 'geojson', data: '/fixtures/land.json' },
          },
          layers: [
            {
              id: 'land',
              type: 'fill',
              source: 'land',
              paint: { 'fill-color': '#f0e9e1' },
            },
          ],
        },
      });

      const mapB = new mapboxgl.Map({
        container: 'mapB',
        zoom: 1,
        center: [0, 0],
        testMode: true,
        style: {
          version: 8,
          sources: {
            land: { type: 'geojson', data: '/fixtures/land.json' },
          },
          layers: [
            {
              id: 'land',
              type: 'fill',
              source: 'land',
              paint: { 'fill-color': '#f0e9e1' },
            },
          ],
        },
      });

      // Initialize Compare slider and remove it
      const container = document.getElementById('compare');
      const compare = new Compare(mapA, mapB, container);
      compare.remove();

      // Move Map B after removing Compare slider
      mapB.jumpTo({
        bearing: 10,
        center: { lat: 26, lng: -105 },
        pitch: 30,
        zoom: 5,
      });

      return {
        zoom: mapA.getZoom(),
        pitch: mapA.getPitch(),
        bearing: mapA.getBearing(),
        center: mapA.getCenter(),
      };
    });

    // Assert maps are no longer synchronized
    expect(result.zoom).not.toBe(5);
    expect(result.pitch).not.toBe(30);
    expect(result.bearing).not.toBe(10);
    expect(result.center.lng).not.toBe(-105);
    expect(result.center.lat).not.toBe(26);
  });
});
