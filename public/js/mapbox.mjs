/* eslint-disable */

const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoibXVoYW1hZGFuZHJlIiwiYSI6ImNsNWpmNmVvNTA1Z3IzanFvMzZ2NGxqMnMifQ.W8n0dswaQgq3UqJccN4mVA';
let map = new mapboxgl.Map({
  container: 'map', //container map need "id"
  style: 'mapbox://styles/muhamadandre/cl5kovu12000b14o4nvqpqy5n',
  scrollZoom: false,
  //center: [-118.113491, 34.111745], // lng, lat
  //zoom: 11,
  //interactive: false, // menonaktifkan all behavior
});

const bounds = new mapboxgl.LngLatBounds(); // LatlngBounds: otomatis search all tours

// add Marker
locations.forEach((loc) => {
  // create element div and add class maker
  const el = document.createElement('div');
  el.className = 'marker';

  // add marker element
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include curernt locations
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 140,
    left: 100,
    right: 100,
  },
});
