<script lang="ts">
  import { onMount } from "svelte";
  import ChartDisplay from "./ChartDisplay.svelte";
  import type { Apartment } from "@shared/types";
  import type { ChartConfiguration } from "chart.js";

  export let apartments: Apartment[] = [];
  export let getChartsFn: (
    apartments: Apartment[],
  ) => ChartConfiguration[] = () => [];
  export let title: string = "Statistics";

  let charts: ChartConfiguration[] = [];

  $: charts = apartments.length > 0 ? getChartsFn(apartments) : [];
</script>

{#if apartments.length === 0}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {#each Array(9) as _, i}
      <div class="w-full max-w-lg bg-card rounded-lg shadow p-4 animate-pulse">
        <!-- Title bar -->
        <div class="h-6 bg-onbg/25 rounded mb-4"></div>

        <!-- "Fun" chart bars -->
        <div class="flex justify-between items-end h-64 gap-2">
          {#each Array(8) as _, j}
            <div
              class="bg-onbg/25 rounded-t"
              style="width: calc(100%/8 - 0.25rem); height: {Math.floor(
                Math.random() * 120 + 40,
              )}px;"
            ></div>
          {/each}
        </div>

        <!-- Optional extra decoration -->
        <div class="mt-4 flex justify-between text-xs text-onsec">
          {#each Array(4) as _, j}
            <div
              class="w-6 h-2 bg-onbg/25 rounded animate-bounce"
              style="animation-delay: {j * 0.1}s"
            ></div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
{:else}
  <div class="flex flex-wrap gap-8 justify-center">
    {#each charts as chart (chart.options?.plugins?.title?.text)}
      <div class="w-full md:flex-1 md:min-w-[800px] max-w-lg">
        <ChartDisplay {chart} />
      </div>
    {/each}
  </div>
{/if}
