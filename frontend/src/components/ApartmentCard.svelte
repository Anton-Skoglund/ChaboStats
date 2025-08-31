<script lang="ts">
  import type { Apartment } from "@shared/types";
  export let apartment: Apartment | null = null;
  export let loading: boolean = false;
</script>

<div
  class="rounded-xl p-6 bg-card shadow-md flex flex-col justify-between
         transition-shadow duration-200
         hover:shadow-lg"
>
  {#if loading}
    <!-- Skeleton -->
    <div class="animate-pulse space-y-4">
      <!-- Header -->
      <div class="space-y-2">
        <div class="h-6 bg-onbg/10 rounded w-1/2"></div>
        <div class="h-4 bg-onbg/10 rounded w-3/4"></div>
        <div class="h-3 bg-onbg/10 rounded w-1/3"></div>
      </div>

      <!-- Stats -->
      <div class="flex flex-wrap gap-2">
        <div class="h-5 w-20 bg-pri/50 rounded"></div>
        <div class="h-5 w-24 bg-pri/50 rounded"></div>
        <div class="h-5 w-32 bg-pri/50 rounded"></div>
      </div>

      <!-- Footer link -->
      <div class="h-10 bg-pri/50 rounded w-1/3 mt-auto"></div>
    </div>
  {:else if apartment}
    <!-- Real Apartment Info -->
    <div>
      <div>
        <h2 class="text-2xl font-bold mb-2 text-oncard">
          {apartment.type}
        </h2>
        <p class="text-oncard/70 mb-2">
          {apartment.address}, {apartment.location}
        </p>
        <p class="text-sm text-oncard/60 mb-4">
          Floor: {apartment.floor.floor} / {apartment.floor.total_floors}
        </p>
      </div>

      <div class="flex flex-wrap gap-2 mb-4">
        <span
          class="bg-privari text-onpri text-sm font-medium px-2 py-1 rounded"
        >
          Size: {apartment.size_sqrM} m²
        </span>
        <span
          class="bg-privari text-onpri text-sm font-medium px-2 py-1 rounded"
        >
          Rent: {apartment.rent_krPerMonth} kr/mån
        </span>
        <span
          class="bg-privari text-onpri text-sm font-medium px-2 py-1 rounded"
        >
          Published: {apartment.published}
        </span>
      </div>

      <a
        href={`#/listings/${apartment.published}/${apartment.objectId}`}
        class="mt-auto inline-block text-onpri bg-pri hover:bg-sec text-center font-semibold py-2 px-4 rounded transition-colors duration-150"
      >
        More info
      </a>
    </div>
  {/if}
</div>
