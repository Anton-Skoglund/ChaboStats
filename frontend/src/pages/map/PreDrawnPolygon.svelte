<script>
  import { onMount } from "svelte";
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";

  let map;

  const center = [57.689249, 11.976888];
  const bounds = [
    [center[0] - 0.1, center[1] - 0.1],
    [center[0] + 0.1, center[1] + 0.1]
  ];

  // Load the manifest
  const manifestFile = "/maps/manifest.json"; // placed in public/

  onMount(async () => {
    map = L.map("map", {
      center,
      zoom: 14,
      minZoom: 12,
      maxZoom: 18,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0
    });

    // OSM tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Fetch manifest
    const manifestResponse = await fetch(manifestFile);
    const files = await manifestResponse.json();

    for (const file of files) {
      try {
        const response = await fetch("/maps/" + file); // fetch each JSON file
        const data = await response.json();

        // Each file can have multiple polygons
        data.forEach(polygonArray => {
          const latlngs = polygonArray.map(coord => [coord.lat, coord.lng]);
          L.polygon(latlngs, { color: "purple", fillOpacity: 0.4 })
            .addTo(map)
            .bindPopup(file);
        });
      } catch (err) {
        console.error("Failed to load file:", file, err);
      }
    }
  });
</script>

<style>
  #map {
    height: 600px;
    width: 100%;
  }
</style>

<div id="map"></div>
