<script lang="ts">
  import { onMount } from "svelte";
  import Router from "svelte-spa-router";
  import routes from "./routes";
  import Navbar from "@components/Nav/Navbar.svelte";
  import { applyChartTheme, refreshAllCharts } from "@pages/statistics/chartDefaults";
  import { Themes } from "@shared/themes";
  
  let theme: Themes = Themes.Light

  function setTheme(t: typeof theme) {
    theme = t;
    document.documentElement.className = t;
    applyChartTheme(t)
    refreshAllCharts()
  }

  onMount(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("✅ Service worker registered"))
        .catch((err) => console.error("SW registration failed", err));
    }
    // set default theme
    document.documentElement.className = theme;
    applyChartTheme(theme)

  });
</script>

<div class="bg-bg text-onpri h-screen flex flex-col">
  <Navbar {setTheme} {theme} />

  <main class="flex-1 overflow-auto text-onbg">
    <Router {routes} />
  </main>
</div>