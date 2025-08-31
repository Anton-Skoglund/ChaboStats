<script lang="ts">
  import IconCard from "@components/IconCard.svelte";
  import { FontAwesomeIcon, faMap, faBlueprint, faLineChart } from "@lib/icons";

  const cards = [
    {
      title: "Listings",
      description: "See apartments",
      icon: faBlueprint,
      href: "#/listings",
    },
    {
      title: "Statistics",
      description: "Graphic content",
      icon: faLineChart,
      href: "#/statistics",
    },
    {
      title: "Map",
      description: "See them in space",
      icon: faMap,
      href: "#/map",
    },
  ];
</script>

<main class="px-8 py-16 max-w-7xl mx-auto text-onbg">
  <!-- Big Header -->
  <header class="text-center mb-16">
    <h1 class="text-5xl md:text-6xl font-bold mb-4 text-onbg">ChaboStats</h1>
    <p class="text-lg md:text-xl text-onbg">
      Explore apartments, stats, and locations all in one place.
    </p>
  </header>

  <!-- Cards Container -->
  <section class="grid grid-cols-1 md:grid-cols-3 gap-8">
    {#each cards as card}
      <IconCard
        href={card.href}
        icon={card.icon}
        title={card.title}
        description={card.description}
      />
    {/each}
  </section>
</main>
