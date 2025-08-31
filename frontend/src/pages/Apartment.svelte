<script lang="ts">
  import {
    FontAwesomeIcon,
    faCalendarAlt,
    faStairs,
    faMoneyBill1,
    faLocation,
    faArea,
    faHeart,
  } from "@lib/icons";

  import convertTripleAsteriskToSvelte from "@lib/convertTripleAsteriskToSvelte";

  import { API_BASE } from "@config/config.js";

  import { onMount } from "svelte";
  import type { Apartment } from "@shared/types";

  export let params: { published: string; objectId: string };

  let apartment: Apartment | null = null;
  let loading = true;
  let error = "";

  onMount(async () => {
    try {
      const res = await fetch(
        `${API_BASE}/${params.published}/${params.objectId}`,
      );
      console.log(res);
      if (!res.ok) throw new Error("Apartment not found");
      apartment = await res.json();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });
</script>

<main class="min-h-screen p-8 bg-bg">
  {#if loading}
    <div class="max-w-4xl mx-auto p-6 space-y-4">
      <div class="h-8 rounded w-3/4 animate-pulse bg-secvari"></div>
      <div class="h-6 rounded w-1/2 animate-pulse bg-secvari"></div>
      <div class="h-4 rounded w-full animate-pulse bg-secvari"></div>
      <div class="h-4 rounded w-full animate-pulse bg-secvari"></div>
      <div class="h-4 rounded w-2/3 animate-pulse bg-secvari"></div>
    </div>
  {:else if error}
    <p class="max-w-4xl mx-auto p-6 font-semibold text-err">
      {error}
    </p>
  {:else if apartment != null}
    <div
      class="max-w-4xl mx-auto p-6 rounded-xl shadow-lg space-y-4 bg-card text-oncard"
    >
      <!-- Header -->
      <h1 class="text-3xl font-bold mb-2 text-pri">
        {apartment.type} @ {apartment.address}
      </h1>

      <!-- Basic Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div
          class="flex items-center gap-2 font-semibold px-3 py-1 rounded-md inline-block bg-pri text-onpri"
          title="Published"
        >
          <FontAwesomeIcon
            icon={faCalendarAlt}
            class="{faCalendarAlt.prefix}-icon"
          />
          {apartment.published}
        </div>

        <div
          class="flex items-center gap-2 font-semibold px-3 py-1 rounded-md inline-block bg-pri text-onpri"
          title="Location"
        >
          <FontAwesomeIcon icon={faLocation} class="{faLocation.prefix}-icon" />
          {apartment.location}
        </div>

        <div
          class="flex items-center gap-2 font-semibold px-3 py-1 rounded-md inline-block bg-pri text-onpri"
          title="Floor"
        >
          <FontAwesomeIcon icon={faStairs} class="{faStairs.prefix}-icon" />
          {apartment.floor.floor} / {apartment.floor.total_floors}
        </div>

        <div
          class="flex items-center gap-2 font-semibold px-3 py-1 rounded-md inline-block bg-pri text-onpri"
          title="Size"
        >
          <FontAwesomeIcon icon={faArea} class="{faArea.prefix}-icon" />
          {apartment.size_sqrM} m²
        </div>

        <div
          class="flex items-center gap-2 font-semibold px-3 py-1 rounded-md inline-block bg-pri text-onpri"
          title="Rent"
        >
          <FontAwesomeIcon
            icon={faMoneyBill1}
            class="{faMoneyBill1.prefix}-icon"
          />
          {apartment.rent_krPerMonth} kr/mån
        </div>
        <div
          class="flex items-center gap-2 font-semibold px-3 py-1 rounded-md inline-block bg-pri text-onpri"
          title="Interested"
        >
          <FontAwesomeIcon icon={faHeart} class="{faHeart.prefix}-icon" />
          {apartment.interested_count}
        </div>
      </div>

      {#if apartment.features.features.length}
        <p class="text-sm mt-2">
          <span class="font-semibold">Features:</span>
          {apartment.features.features.join(", ")}
        </p>
      {/if}

      <!-- Descriptions -->
      {#if apartment.descriptions.length}
        <div class="descriptions">
          {#each apartment.descriptions as desc}
            {@html convertTripleAsteriskToSvelte(desc)}
          {/each}
        </div>
      {/if}

      <!-- Source Link -->
      <a
        href={`/${apartment.image_file}`}
        target="_blank"
        class="mt-4 inline-block font-medium hover:underline text-pri"
      >
        More info
      </a>
    </div>
  {/if}
</main>

<style>
  :global(.bilingual.rich-text) {
    margin-top: 1rem;
    font-size: 0.875rem;
    line-height: 1.625;
  }
  :global(.bilingual-block) {
    margin-bottom: 1rem;
  }
  :global(.bilingual-block p.sv) {
    font-weight: 500;
  }
  :global(.bilingual-block p.en) {
    font-style: italic;
  }
</style>
