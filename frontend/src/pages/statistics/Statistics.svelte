<script lang="ts">
  import Fa from "svelte-fa";
  import {
    faMoneyBill1,
    faLineChart,
    faCalendarAlt,
    faUser,
    faClipboard,
  } from "@lib/icons";

  import IconCard from "@components/IconCard.svelte";

  const statCards = [
    {
      title: "Rent",
      href: "#/statistics/rent",
      icon: faMoneyBill1,
      description: "About that money",
    },
    {
      title: "Released",
      href: "#/statistics/released",
      icon: faCalendarAlt,
      description: "How many released",
    },
    {
      title: "Interested",
      href: "#/statistics/interested",
      icon: faUser,
      description: "How many interested",
    },
    {
      title: "Features",
      href: "#/statistics/feature",
      icon: faClipboard,
      description: "Feature they have",
    },
  ];

</script>

<main class="px-8 py-16 max-w-7xl mx-auto text-onbg">
  <h1
    class="text-onbg text-4xl md:text-5xl font-extrabold text-center mb-16 flex items-center justify-center gap-4"
  >
    <Fa
      icon={faLineChart}
      class="{faLineChart.prefix}-icon w-12 h-12 text-privari animate-bounce"
    />
    Statistics Hub
  </h1>

  <nav class="grid grid-cols-1 md:grid-cols-4 gap-8">
    {#each statCards as card}
      <IconCard
        href={card.href}
        icon={card.icon}
        title={card.title}
        description={card.description}
      />
    {/each}
  </nav>
</main>
