import "./chartDefaults"; // import global defaults first
import { Chart, type ChartConfiguration } from "chart.js";
import type { Apartment, SearchableFeatures } from "@shared/types";

import { THEME } from "./chartDefaults";



export function getCharts(apartments: Apartment[]) {
    const featureKeys: (keyof SearchableFeatures)[] = [
        "corner",
        "balcony",
        "power_individual_measurement",
        "hot_water_individual_measurement",
        "cycling_room",
    ];

    const yesCounts = featureKeys.map(f =>
        apartments.filter(a => a.features.searchable_features[f] === true).length
    );
    const noCounts = featureKeys.map(f =>
        apartments.filter(a => a.features.searchable_features[f] === false).length
    );
    const nullCounts = featureKeys.map(f =>
        apartments.filter(a => a.features.searchable_features[f] === null).length
    );

    const config: ChartConfiguration<'bar', number, string> = {
        type: "bar",
        data: {
            labels: featureKeys.map(f => f.replace(/_/g, " ")),
            datasets: [
                { label: "Yes", data: yesCounts, backgroundColor: THEME.pri() },
                { label: "No", data: noCounts, backgroundColor: THEME.sec() },
                { label: "Unknown", data: nullCounts, backgroundColor: "gray" },
            ],
        },
        options: {
            responsive: true,
            indexAxis: "y",
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: "Number of Apartments" },
                },
                y: {
                    title: { display: true, text: "Feature" },
                },
            },
        },
    };

    const yesAverages = featureKeys.map((f) => {
        const withFeature = apartments.filter(
            (a) => a.features.searchable_features[f] === true
        );
        if (withFeature.length === 0) return 0;
        return (
            withFeature.reduce((sum, a) => sum + a.interested_count, 0) / withFeature.length
        );
    });

    const noAverages = featureKeys.map((f) => {
        const withoutFeature = apartments.filter(
            (a) => a.features.searchable_features[f] === false
        );
        if (withoutFeature.length === 0) return 0;
        return (
            withoutFeature.reduce((sum, a) => sum + a.interested_count, 0) /
            withoutFeature.length
        );
    });

    const chartConfig: ChartConfiguration<"bar", number[], string> = {
        type: "bar",
        data: {
            labels: featureKeys.map((f) => f.replace(/_/g, " ")),
            datasets: [
                { label: "Has Feature", data: yesAverages, backgroundColor: THEME.pri() },
                { label: "No Feature", data: noAverages, backgroundColor: THEME.sec() },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Average Interest by Feature",
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: "Average Interested Count" },
                },
            },
        },
    };

    return [config, chartConfig];
}



/*

 {
      
        
        {
            title: "Average Interest by Feature",
            type: "bar",
            data: (() => {
                const featureKeys: (keyof SearchableFeatures)[] = [
                    "corner",
                    "balcony",
                    "power_individual_measurement",
                    "hot_water_individual_measurement",
                    "cycling_room",
                ];

                const yesAverages = featureKeys.map((f) => {
                    const withFeature = apartments.filter(
                        (a) => a.features.searchable_features[f] === true
                    );
                    if (withFeature.length === 0) return 0;
                    return (
                        withFeature.reduce((sum, a) => sum + a.interested_count, 0) /
                        withFeature.length
                    );
                });

                const noAverages = featureKeys.map((f) => {
                    const withoutFeature = apartments.filter(
                        (a) => a.features.searchable_features[f] === false
                    );
                    if (withoutFeature.length === 0) return 0;
                    return (
                        withoutFeature.reduce((sum, a) => sum + a.interested_count, 0) /
                        withoutFeature.length
                    );
                });

                return {
                    labels: featureKeys.map((f) => f.replace(/_/g, " ")),
                    datasets: [
                        { label: "Has Feature", data: yesAverages, backgroundColor: "blue" },
                        { label: "No Feature", data: noAverages, backgroundColor: "orange" },
                    ],
                };
            })(),
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: "Average Interested Count" },
                    },
                },
            },
        }

        */