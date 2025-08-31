<script lang="ts">
  interface Props {
    id: string;
    selected?: string;               
    kvPairs?: Record<string, string>;  // key-value pairs for options
  }

  let {
    id,
    selected = $bindable(""),
    kvPairs = $bindable({}),
  }: Props = $props();

  // fallback for null
  selected = selected ?? "";
  kvPairs = kvPairs ?? {};
</script>

{#if Object.keys(kvPairs).length > 0}
  <select
    {id}
    class="w-full p-2 border rounded-md border-none bg-card shadow-md/20 text-oncard focus:outline-none focus:ring-2 focus:ring-privari"
    bind:value={selected}
  >
    <option value="">No selected</option>
    {#each Object.entries(kvPairs) as [key, value]}
      <option value={key}>{value}</option>
    {/each}
  </select>
{:else}
  <div class="p-2 text-sm text-muted">Loading options...</div>
{/if}
