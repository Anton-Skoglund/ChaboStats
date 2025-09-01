
let listings = [];

async function loadData() {
  if (!listings.length) {
    const res = await fetch("/ChaboStats/data.json");
    listings = await res.json();
    swLog("garb data")

  }
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const parts = url.pathname.split("/").filter(Boolean); // ["api", "listings", ...]

  if (url.pathname.startsWith("/ChaboStats/api/listings")) {
    event.respondWith(
      (async () => {
        await loadData();
        
        // /api/listings → return filtered by minSize/maxSize
        if (parts.length === 3) {
          const qp = url.searchParams;
          const minSize = Number(qp.get("minSize")) || 0;
          const maxSize = Number(qp.get("maxSize")) || Infinity;
          const locationCode = decodeURIComponent((qp.get("locationCode") || "").trim().toLowerCase());

          const minSizeNum = Math.max(0, minSize);
          const maxSizeNum = Math.max(minSizeNum, maxSize);

          const result = listings.filter(
            (listing) =>
              listing.size_sqrM >= minSizeNum &&
              listing.size_sqrM <= maxSizeNum &&
              listing.locationCode.toLowerCase().includes(locationCode)
          );

          return new Response(JSON.stringify(result), {
            headers: { "Content-Type": "application/json" },
          });
        }

        // /api/listings/:id → find by objectId
        if (parts.length === 4) {
          const id = parts[3];
          const listing = listings.find((item) => item.objectId === id);

          if (listing) {
            return new Response(JSON.stringify(listing), {
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(
            JSON.stringify({ error: "Listing not found" }),
            { status: 404, headers: { "Content-Type": "application/json" } }
          );
        }

        // /api/listings/:published/:objectId → find by published + objectId
        if (parts.length === 5) {
          const [, , published, objectId] = parts;
          const listing = listings.find(
            (item) => item.published === published && item.objectId === objectId
          );

          if (listing) {
            return new Response(JSON.stringify(listing), {
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(
            JSON.stringify({ error: "Listing not found" }),
            { status: 404, headers: { "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ error: "Invalid route" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      })()
    );
  }

  if (url.pathname.startsWith("/ChaboStats/api/location")) {
  event.respondWith(
    (async () => {
      await loadData();

      // /api/location/:code
      if (parts.length === 4) {
        const code = parts[3].toLowerCase();
        const result = listings.filter(
          (listing) => listing.locationCode.toLowerCase() === code
        );
        

        return new Response(JSON.stringify(result), {
          
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({ error: "Invalid /api/location route" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    })()
  );
}
});
