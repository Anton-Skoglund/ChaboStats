<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { ChartConfiguration } from "chart.js";
  import { Chart } from "chart.js";

  import './chartSetup'
  export let chart: ChartConfiguration;

  let canvas: HTMLCanvasElement;
  let instance: Chart;

  onMount(() => {
    // Use the canvas element, not just the context
    instance = new Chart(canvas, chart);
  });

  onDestroy(() => {
    instance?.destroy();
  });
</script>

<div class="max-w-4xl mx-auto bg-card rounded-xl shadow-md p-6">
  <canvas bind:this={canvas} class="w-full h-80 md:h-96"></canvas>
</div>
