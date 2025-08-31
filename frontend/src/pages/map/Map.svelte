<script lang="ts">
  import { onMount } from "svelte";
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";

  import { getCSSVar } from "@lib/cssvar";

  let map: L.Map | undefined;

  const center: L.LatLngTuple = [57.689249, 11.976888];
  const bounds: L.LatLngBoundsLiteral = [
    [center[0] - 0.1, center[1] - 0.1],
    [center[0] + 0.1, center[1] + 0.1],
  ];

  const manifestFile = "/maps/manifest.json";

  type Coordinate = { lat: number; lng: number };
  type PolygonData = Coordinate[];

  onMount(async () => {
    map = L.map("map", {
      center,
      zoom: 14,
      minZoom: 12,
      maxZoom: 18,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    try {
      const manifestResponse = await fetch(manifestFile);
      if (!manifestResponse.ok) throw new Error("Failed to fetch manifest");
      const files: string[] = await manifestResponse.json();

      for (const file of files) {
        try {
          const response = await fetch("/maps/" + file);
          if (!response.ok) throw new Error(`Failed to fetch ${file}`);
          const data: PolygonData[] = await response.json();

          data.forEach((polygonArray) => {
            const latlngs: L.LatLngTuple[] = polygonArray.map(
              (coord) => [coord.lat, coord.lng] as L.LatLngTuple,
            );
            if (map) {
              L.polygon(latlngs, {
                color: getCSSVar("--sec"),
                fillOpacity: 0.4,
              })
                .addTo(map)
                .bindPopup(`<a href="#/location/${file.replace(/.json$/i, "")}">Go to Location</a>`);
            }
          });
        } catch (err) {
          console.error("Failed to load file:", file, err);
        }
      }
    } catch (err) {
      console.error("Failed to load manifest:", err);
    }
  });
</script>

<div class="flex h-full items-center justify-center">
  <div class="bg-card w-full max-w-[1200px] p-10 rounded-lg">
    <div id="map" class="w-full h-[600px] bg-bg rounded-lg shadow-md"></div>
  </div>
</div>
