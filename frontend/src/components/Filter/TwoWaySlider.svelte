<script lang="ts">
  interface Props {
    id?: string;
    min?: number;
    max?: number;
    step?: number;
    lowPointer?: number | null;
    highPointer?: number | null;
  }

  let {
    id = "",
    min = 0,
    max = 100,
    step = 1,
    lowPointer = $bindable(),
    highPointer = $bindable(),
  }: Props = $props();

  // Handle null values manually
  lowPointer = lowPointer ?? min; // if lowPointer is null or undefined, use min
  highPointer = highPointer ?? max; // if highPointer is null or undefined, use max

  let dragging: "low" | "high" | null = null;
  let track: HTMLDivElement;

  function percentToValue(pct: number) {
    const raw = min + (pct / 100) * (max - min);
    return Math.round(raw / step) * step;
  }

  function handlePointerDown(which: "low" | "high", e: PointerEvent) {
    dragging = which;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: PointerEvent) {
    if (!dragging) return;

    const rect = track.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    const value = percentToValue(Math.min(100, Math.max(0, pct)));

    if (dragging === "low") {
      if (value <= highPointer) lowPointer = value;
      else lowPointer = highPointer;
    } else {
      if (value >= lowPointer) highPointer = value;
      else highPointer = lowPointer;
    }
  }

  function handlePointerUp(e: PointerEvent) {
    dragging = null;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }
</script>

<div
  bind:this={track}
  class="relative w-full h-6"
  on:pointermove={handlePointerMove}
  on:pointerup={handlePointerUp}
>
  <!-- Track background -->
  <div
    class="absolute top-1/2 -translate-y-1/2 w-full h-2 rounded bg-oncard/20"
  ></div>

  <!-- Active range highlight -->
  <div
    class="absolute top-1/2 -translate-y-1/2 h-2 rounded bg-pri"
    style="
      left: {((lowPointer - min) / (max - min)) * 100}%;
      width: {((highPointer - lowPointer) / (max - min)) * 100}%;
    "
  ></div>

  <!-- Low thumb -->
  <div
    role="slider"
    tabindex="0"
    class="absolute top-1/2 w-4 h-4 rounded-full bg-sec shadow cursor-pointer"
    style="left: {((lowPointer - min) / (max - min)) *
      100}%; transform: translate(-50%, -50%);"
    on:pointerdown={(e) => handlePointerDown("low", e)}
  ></div>

  <!-- High thumb -->
  <div
    role="slider"
    tabindex="0"
    class="absolute top-1/2 w-4 h-4 rounded-full bg-sec shadow cursor-pointer"
    style="left: {((highPointer - min) / (max - min)) *
      100}%; transform: translate(-50%, -50%);"
    on:pointerdown={(e) => handlePointerDown("high", e)}
  ></div>
</div>
