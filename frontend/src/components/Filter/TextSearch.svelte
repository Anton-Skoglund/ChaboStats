<script lang="ts">
  export let value: string;
  export let placeholder = "Search...";
</script>

<input
  type="text"
  bind:value={value}
  placeholder={placeholder}
  class="
    w-full
    px-4
    py-3
    text-gray-800
    placeholder-gray-400
    border
    border-gray-300
    rounded-xl
    shadow-sm
    focus:outline-none
    focus:ring-2
    focus:ring-blue-400
    focus:border-blue-400
    transition
    duration-200
    ease-in-out
  "
/>
