<script lang="ts">

  import { FontAwesomeIcon, faHouse, faMap, faSun, faMoon, faList, faLineChart, faQuestion, faBlueprint} from "@lib/icons"

  import { Themes } from "@shared/themes";
    import { icon } from "leaflet";
  const buttons = [
    { theme: Themes.Light, icon: faSun, color: "text-onsec" },
    {
      theme: Themes.Dark,
      icon: faMoon,
      color: "text-onsec",
    },
    { theme: Themes.Blue, icon: faBlueprint, color: "text-onsec" },
  ];

  function changeTheme(t: Themes) {
    theme = t;
    setTheme(t);
  }

  $: currentIndex = buttons.findIndex((b) => b.theme === theme);
  $: highlightX = `translateX(${currentIndex * 32}px)`;

  export let setTheme: (t: Themes) => void;
  export let theme: Themes;
</script>

<nav class="flex items-center justify-between px-6 py-4 bg-card shadow-md">
  <!-- Logo / Brand -->
  <a href="#/" class="flex items-center gap-2 text-3xl font-bold text-oncard">
    <FontAwesomeIcon icon={faHouse} class="{faHouse.prefix}-icon w-6 h-6" /> <h1>ChaboStats</h1>
  </a>

  <!-- Links -->
  <div class="hidden md:flex space-x-6">
    <a
      href="#/listings"
      class="flex items-center gap-1 text-oncard hover:text-sec transition-colors duration-200 font-medium"
    >
      <FontAwesomeIcon icon={faList} class="{faList.prefix}-icon w-5 h-5" /> Listings
    </a>
    <a
      href="#/statistics"
      class="flex items-center gap-1 text-oncard hover:text-sec transition-colors duration-200 font-medium"
    >
      <FontAwesomeIcon icon={faLineChart} class="{faLineChart.prefix}-icon w-5 h-5" /> Statistics
    </a>
    <a
      href="#/map"
      class="flex items-center gap-1 text-oncard hover:text-sec transition-colors duration-200 font-medium"
    >
      <FontAwesomeIcon icon={faMap} class="{faMap.prefix}-icon w-5 h-5" /> Map
    </a>

    <a
      href="#/test"
      class="flex items-center gap-1 text-oncard hover:text-sec transition-colors duration-200 font-medium"
    >
      <FontAwesomeIcon icon={faQuestion} class="{faQuestion.prefix}-icon w-5 h-5" /> *test*
    </a>
  </div>

  <div class="hidden md:flex relative bg-pri/50 rounded-xl p-1">
    <!-- sliding highlight -->
    <div
      class="absolute top-1 bottom-1 w-8 rounded-lg bg-sec shadow transition-transform duration-300"
      style:transform={highlightX}
    ></div>

    {#each buttons as b}
      <button
        on:click={() => changeTheme(b.theme)}
        class="relative z-10 w-8 h-8 flex items-center justify-center {b.color}"
        aria-label={b.theme + " theme"}
      >
        <FontAwesomeIcon icon={b.icon} class=" {b.icon.prefix}-icon w-4 h-4" />
      </button>
    {/each}
  </div>
</nav>
