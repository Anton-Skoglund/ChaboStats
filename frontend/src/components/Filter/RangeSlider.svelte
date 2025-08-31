<script lang="ts">
  interface SliderProps {
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    value: number; // will be bindable
  }

  let {
    label = "",
    min = 0,
    max = 100,
    step = 1,
    value = $bindable(0)
  }: SliderProps = $props();
</script>

<div class="flex flex-col gap-2">
  <div class="flex justify-between items-center">
    <label for="range" class="font-semibold text-[color:var(--onsec)]">{label}</label>
    <span class="font-medium text-[color:var(--onsec)]">{value}</span>
  </div>

  <input
    type="range"
    {min}
    {max}
    {step}
    bind:value
    class="
      w-full
      h-2
      rounded-lg
      accent-[color:var(--pri)]
      hover:accent-[color:var(--privari)]
      focus:outline-none
      focus:ring-1
      focus:ring-[color:var(--privari)]
      transition
      duration-150
      ease-in-out
    "
  />
</div>
