<script lang="ts">
    import { FontAwesomeIcon, type IconDefinition } from "@lib/icons";

    interface CardProps {
        href: string;
        icon: IconDefinition;
        title: string;
        description: string;
    }

    export let href: string;
    export let icon: IconDefinition;
    export let title: string;
    export let description: string;


</script>

<a
    {href}
    class="custom-border bg-card text-oncard p-8 rounded-xl flex flex-col items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-transform transition-shadow"
>
    <FontAwesomeIcon
        {icon}
        class="{icon.prefix}-icon text-oncard text-7xl mb-4"
    />
    <h2 class="text-2xl font-semibold mb-2">{title}</h2>
    <p class="text-center text-oncard">{description}</p>
</a>

