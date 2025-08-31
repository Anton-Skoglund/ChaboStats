<script lang="ts">
  import { onMount } from "svelte";
  import type { Apartment } from "@shared/types";
  import ApartmentCard from "@components/ApartmentCard.svelte";
  import FilterPanel from "@components/Filter/ApartmentFilterPanel.svelte";

  let listings: Apartment[] = [];
  let lowSize: number | null = null;
  let highSize: number | null = null;
  let lowRent: number | null = null;
  let highRent: number | null = null;
  let selectedLocation:string | null = null; // from query string
  let selectedFeature: string | null = null;
  let loading = true; // track loading state

  async function fetchListings() {
    loading = true;

    try {
      // If the user navigated with a locationCode query param, use it
      // Get the hash (everything after #)
      const hash = window.location.hash; // "#/listings?locationCode=chabo"

      // Split into path and query string
      const [path, queryString] = hash.split("?");

      // Parse the query string
      const params = new URLSearchParams(queryString);
      const locationCode = params.get("locationCode"); // "chabo"

      if (locationCode && !selectedLocation) selectedLocation = locationCode;

      updateUrl()

      const res = await fetch(
        `/api/listings?minSize=${lowSize}&maxSize=${highSize}&locationCode=${selectedLocation}`,
      );
      listings = await res.json();
    } catch (e) {
      console.error("Error fetching listings:", e);
      listings = [];
    } finally {
      loading = false;
    }
  }

  function updateUrl() {
    const params = new URLSearchParams();
    if (lowSize != null) params.set("minSize", String(lowSize));
    if (highSize != null) params.set("maxSize", String(highSize));
    if (lowRent != null) params.set("minRent", String(lowRent));
    if (highRent != null) params.set("maxRent", String(highRent));
    if (selectedLocation) params.set("locationCode", selectedLocation);

    window.location.hash = `/listings?${params.toString()}`;
  }

  onMount(() => {
    fetchListings();
  });
</script>

<div class="px-6 md:px-12 lg:px-20 py-8 flex justify-center">
  <div
    class="w-full max-w-[300px] md:max-w-[2000px] mx-auto flex flex-wrap md:flex-nowrap gap-8"
  >
    <!-- Filter panel -->
    <div class="w-full max-w-[300px] lg:w-1/4">
      <FilterPanel
        bind:lowSize
        bind:highSize
        bind:lowRent
        bind:highRent
        bind:selectedLocation
        bind:selectedFeature
        onApplyFilters={fetchListings}
      />
    </div>

    <!-- Apartment listings -->
    <div class="w-full lg:w-3/4">
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {#if loading}
          {#each Array(9) as _}
            <ApartmentCard loading={true} />
          {/each}
        {:else if listings.length === 0}
          <p
            class="col-span-full text-center px-6 py-4 rounded-lg shadow-md text-lg font-medium flex items-center justify-center gap-2 text-onerr bg-err"
          >
            <span>😕</span>
            Oops, nothing matched your filters.
          </p>
        {:else}
          {#each listings as item}
            <ApartmentCard apartment={item} />
          {/each}
        {/if}
      </div>
    </div>
  </div>
</div>
