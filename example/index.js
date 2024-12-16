import 'mapbox-gl-compare-enhanced/dist/style.css'
import Compare from 'mapbox-gl-compare-enhanced'

mapboxgl.accessToken = localStorage.getItem('MapboxAccessToken') || 'YOUR_MAPBOX_ACCESS_TOKEN';

const before = new mapboxgl.Map({
  container: 'before',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [0, 0],
  zoom: 2,
});

const after = new mapboxgl.Map({
  container: 'after',
  style: 'mapbox://styles/mapbox/dark-v9',
  center: [0, 0],
  zoom: 2,
});

// Initialize the comparison slider
const container = '#wrapper';
const compare = new Compare(before, after, container, {
  mousemove: true,
  orientation: 'horizontal',
});

// Handle "close comparison" button
document.getElementById('close-button').addEventListener('click', () => {
  document.getElementById('after').style.display = 'none';
  compare.remove();
  after.remove();
});
