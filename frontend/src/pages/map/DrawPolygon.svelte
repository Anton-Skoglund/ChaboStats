<script>
    import { onMount } from "svelte";
    import L from "leaflet";
    import "leaflet/dist/leaflet.css";

    import "leaflet-draw/dist/leaflet.draw.css";
    import "leaflet-draw";

    let map;

    const center = [57.689249, 11.976888];
    const bounds = [
        [center[0] - 0.1, center[1] - 0.1], // SW
        [center[0] + 0.1, center[1] + 0.1], // NE
    ];

    onMount(() => {
        // Initialize map
        map = L.map("map", {
            center,
            zoom: 15,
            minZoom: 15,
            maxZoom: 18,
            maxBounds: bounds,
            maxBoundsViscosity: 1.0, // fully restrict panning outside bounds
        });

        // Add OSM tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        // Layer to store drawn items
        const drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);

        // Draw control (polygons only)
        const drawControl = new L.Control.Draw({
            draw: {
                polyline: false,
                rectangle: false,
                circle: false,
                marker: false,
                circlemarker: false,
                polygon: {
                    allowIntersection: false, // don't allow self-intersections
                    showArea: true,
                    shapeOptions: { color: "purple" },
                    drawError: { color: "#e1e100", timeout: 1000 },
                    // maxPoints: undefined -> unlimited points
                },
            },
            edit: { featureGroup: drawnItems },
        });

        map.addControl(drawControl);

        // Handle created polygons
        map.on(L.Draw.Event.CREATED, (e) => {
            const layer = e.layer;
            drawnItems.addLayer(layer);
            console.log("Polygon coordinates:", layer.getLatLngs());
        });
    });
</script>

<div id="map"></div>

<style>
    #map {
        height: 800px;
        width: 100%;
    }
</style>
