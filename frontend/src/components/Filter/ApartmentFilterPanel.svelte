<script lang="ts">
  import TextSearch from "@components/Filter/TextSearch.svelte";
  import RangeSlider from "@components/Filter/RangeSlider.svelte";
  import OptionSelector from "@components/Filter/OptionSelector.svelte";
  import TwoWaySlider from "@components/Filter/TwoWaySlider.svelte";

  import { onMount } from "svelte";
  import staticData from "@shared/static.json";
  import type { SearchableFeatures } from "@shared/types";

  interface FilterPanelProps {
    selectedLocation?: string | null;
    selectedFeature?: string;
    minSize?: number;
    maxSize?: number;
    lowSize?: number | null;
    highSize?: number | null;
    minRent?: number;
    maxRent?: number;
    lowRent?: number | null;
    highRent?: number | null;
    onApplyFilters?: () => void;
  }

  // Destructure props with defaults
  let {
    selectedLocation = $bindable(""),
    selectedFeature = $bindable(""),
    minSize = 0,
    maxSize = 100,
    lowSize = $bindable(null),
    highSize = $bindable(null),

    minRent = 0,
    maxRent = 10000,
    lowRent = $bindable(null),
    highRent = $bindable(null),

    onApplyFilters = () => {},
  }: FilterPanelProps = $props();

  type SearchableFeatureKey = keyof SearchableFeatures;

  let searchableFeatureOptions: SearchableFeatureKey[] = [
    "corner",
    "balcony",
    "power_individual_measurement",
    "hot_water_individual_measurement",
    "cycling_room",
  ];

  // Convert to key-value pairs where key = value, value = label (or formatted)
  let searchableFeatureKvPairs: Record<string, string> = {};
  searchableFeatureOptions.forEach((key) => {
    // Optionally format the label nicely
    const label = key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    searchableFeatureKvPairs[key] = label;
  });

  type Building = { name: string; code: string };

  let buildingsKvPairs: Record<string, string> = $state({});

  onMount(() => {
    const data: Building[] = staticData.cha_stu_bo.building_codes;

    buildingsKvPairs = {};
    data.forEach((b) => {
      // Use alias[0] as key if exists, otherwise name
      const key = b.code;
      buildingsKvPairs[key] = b.name; // value is the display name
    });
  });
</script>

<div class="p-6 bg-card rounded-xl shadow-md flex flex-col gap-6">
  <!-- Size Range -->
  <div class="flex flex-col gap-2">
    <label for="location" class="font-semibold text-oncard">Location</label>
    <OptionSelector
      id="location"
      bind:selected={selectedLocation}
      bind:kvPairs={buildingsKvPairs}
    />

    <label for="feature" class="font-semibold text-oncard">Feature</label>
    <OptionSelector
      id="feature"
      bind:selected={selectedFeature}
      bind:kvPairs={searchableFeatureKvPairs}
    />

    <div class="flex justify-between items-center">
      <label for="sizeRange" class="font-semibold text-oncard">Size (m²)</label>
      <span class="text-oncard font-medium">{lowSize} - {highSize}</span>
    </div>

    <TwoWaySlider
      id="sizeRange"
      min={minSize}
      max={maxSize}
      bind:lowPointer={lowSize}
      bind:highPointer={highSize}
    />

    <!-- Rent Range -->
    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center">
        <label for="rentRange" class="font-semibold text-oncard">Rent</label>
        <span class="text-oncard font-medium">{lowRent} - {highRent}</span>
      </div>

      <TwoWaySlider
        id="rentRange"
        min={minRent}
        max={maxRent}
        bind:lowPointer={lowRent}
        bind:highPointer={highRent}
      />
    </div>
  </div>

  <!-- Apply Button -->
  <button
    class="px-4 py-2 bg-pri text-onpri rounded-lg shadow hover:bg-privari"
    onclick={onApplyFilters}
  >
    Apply Filters
  </button>
</div>
