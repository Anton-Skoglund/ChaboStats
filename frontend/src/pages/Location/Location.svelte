<script lang="ts">
  import { onMount } from "svelte";
  import type { Apartment, SearchableFeatures } from "@shared/types";
  import { wrap } from "svelte-spa-router/wrap";
  import ChartsSection from "../statistics/ChartsSection.svelte";
  import { getCharts } from "./locationChart";

  export let params: { area: string }; // router injects this automatically

  let apartments: Apartment[] = [];
  let locationCode = params.area; // use route param

  onMount(async () => {
    try {
      const res = await fetch(`/api/location/${locationCode}`);
      if (!res.ok) throw new Error("Failed to fetch apartments");
      apartments = await res.json();
    } catch (e) {
      console.error(e);
      apartments = [];
    }
  });

  let avgSize: number = 0;
  let avgRent: number = 0;

  // Reactive stats object
  $: stats =
    apartments.length > 0
      ? (() => {
          // Size
          const sizes = apartments.map((a) => a.size_sqrM);
          const avgSize =
            sizes.reduce((sum, s) => sum + s, 0) / apartments.length;
          const minSize = Math.min(...sizes);
          const maxSize = Math.max(...sizes);

          // Rent
          const rents = apartments.map((a) => a.rent_krPerMonth);
          const avgRent =
            rents.reduce((sum, r) => sum + r, 0) / apartments.length;
          const minRent = Math.min(...rents);
          const maxRent = Math.max(...rents);

          // Feature percentages
          const featureCount = (feature: keyof SearchableFeatures) =>
            apartments.filter((a) => a.features.searchable_features[feature])
              .length;

          const percentCorner =
            (featureCount("corner") / apartments.length) * 100;
          const percentBalcony =
            (featureCount("balcony") / apartments.length) * 100;
          const percentHotWater =
            (featureCount("hot_water_individual_measurement") /
              apartments.length) *
            100;
          const percentPower =
            (featureCount("power_individual_measurement") / apartments.length) *
            100;
          const percentCycling =
            (featureCount("cycling_room") / apartments.length) * 100;

          return {
            avgSize,
            minSize,
            maxSize,
            avgRent,
            minRent,
            maxRent,
            percentCorner,
            percentBalcony,
            percentHotWater,
            percentPower,
            percentCycling,
          };
        })()
      : null;
</script>

<div class="p-6 md:p-8 bg-bg rounded-lg shadow-md flex flex-col items-start gap-4">
  <!-- Location heading -->
  <h1 class="text-3xl font-bold text-onbg">{locationCode}</h1>

  <!-- Link styled as a button -->
  <a
    href={`#/listings?locationCode=${locationCode}`}
    class="inline-block px-4 py-2 bg-pri text-onpri font-semibold rounded hover:bg-privari transition-colors duration-200"
  >
    View listings
  </a>
  {#if stats}
   <div class="flex flex-col md:flex-row justify-center gap-4 p-4">
  <!-- Section 1: Size & Rent -->
  <div class="bg-card p-4 rounded-lg shadow-md flex-1">
    <h3 class="text-lg font-semibold mb-2 text-oncard">Size & Rent</h3>
    <div class="flex flex-col gap-1 text-oncard">
      <div>Size: {stats.avgSize.toFixed(1)} m² (min: {stats.minSize}, max: {stats.maxSize})</div>
      <div>Rent: {stats.avgRent.toFixed(0)} kr (min: {stats.minRent}, max: {stats.maxRent})</div>
    </div>
  </div>

  <!-- Section 2: Corner & Balcony -->
  <div class="bg-card p-4 rounded-lg shadow-md flex-1">
    <h3 class="text-lg font-semibold mb-2 text-oncard">Corner & Balcony</h3>
    <div class="flex flex-col gap-1 text-oncard">
      <div>Corner Apartments: {stats.percentCorner.toFixed(1)}%</div>
      <div>Balcony: {stats.percentBalcony.toFixed(1)}%</div>
    </div>
  </div>

  <!-- Section 3: Hot/Power & Cycling Room -->
  <div class="flex flex-col bg-card p-4 rounded-lg shadow-md flex-1">
    <h3 class="text-lg font-semibold mb-2 text-oncard">Utilities & Amenities</h3>
    <div class="gap-1 text-oncard">
      <div>Hot Water Individual Measurement: {stats.percentHotWater.toFixed(1)}%</div>
      <div>Power Individual Measurement: {stats.percentPower.toFixed(1)}%</div>
      <div>Cycling Room: {stats.percentCycling.toFixed(1)}%</div>
    </div>
  </div>
</div>

  {:else}
    <p>Loading statistics...</p>
  {/if}

  <div class="p-6 md:p-10">
    <h1 class="text-3xl font-bold mb-8 text-oncard">
      Statistics
    </h1>
    <ChartsSection {apartments} getChartsFn={getCharts} />
  </div>
</div>
