<script lang="ts">
  import ChartsSection from "./ChartsSection.svelte";
  import { getCharts } from "./getFeatureCharts";
  import { onMount } from "svelte";
  import type { Apartment } from "@shared/types";


  
  let apartments: Apartment[] = [];

  onMount(async () => {
    const res = await fetch("http://localhost:3000/api/listings");
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    apartments = await res.json();
  });


</script>

<div class="p-6 md:p-10 rounded-lg shadow-sm">
  <h1 class="text-3xl font-bold mb-8 text-oncard">Features</h1>
<ChartsSection apartments={apartments} getChartsFn={getCharts} title="Interest Statistics" />
</div>