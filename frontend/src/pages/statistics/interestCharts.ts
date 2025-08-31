import "./chartDefaults"; // import global defaults first
import { Chart } from "chart.js";
import type { Apartment } from "@shared/types";
import type { ChartConfiguration } from "./chartConfig";
import { THEME } from "./chartDefaults";

export function getCharts(apartments: Apartment[]) {
  // Labels for per-listing chart
  const listingLabels = apartments.map((a) => a.address);
  const interestedCounts = apartments.map((a) => a.interested_count);

  // Aggregate interest by location
  const locationInterest: Record<string, { total: number; count: number }> = {};
  for (const a of apartments) {
    if (!locationInterest[a.location]) locationInterest[a.location] = { total: 0, count: 0 };
    locationInterest[a.location].total += a.interested_count;
    locationInterest[a.location].count += 1;
  }
  const locations = Object.keys(locationInterest);
  const totalInterest = locations.map((loc) => locationInterest[loc].total);
  const avgInterest = locations.map((loc) => locationInterest[loc].total / locationInterest[loc].count);

  const interestedPerListing: ChartConfiguration<'bar', number, string> = {
    type: 'bar',
    data: {
      labels: listingLabels, // string[]
      datasets: [
        {
          label: 'Interested Count',
          data: interestedCounts, // number[]
          backgroundColor: THEME.pri()
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
    plugins: [], // optional, can omit if no plugins
  };

  const interestedVsSize: ChartConfiguration<'scatter', { x: number; y: number }, never> = {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Interested vs Size',
          data: apartments.map(a => ({ x: a.size_sqrM, y: a.interested_count })),
          backgroundColor: THEME.pri()
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Interested vs Size',
        },
      },
      scales: {
        x: {
          title: { display: true, text: 'Size (m²)' },
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Number of Interested People' },
        },
      },
    },
    plugins: [], // optional
  };


  const interestedvsRent: ChartConfiguration<'scatter', { x: number; y: number }, never> = {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Interested vs Rent',
          data: apartments.map(a => ({ x: a.rent_krPerMonth, y: a.interested_count })),
          backgroundColor: THEME.pri()
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Interested vs Rent',
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Rent (kr/mån)',
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Interested People',
          },
        },
      },
    },
    plugins: [], // optional
  };

  const intrestedVsLocation: ChartConfiguration<'bar', number, string> = {
    type: 'bar',
    data: {
      labels: locations, // string[]
      datasets: [
        { label: 'Total Interested People', data: totalInterest, backgroundColor: THEME.pri() }, // number[]
        { label: 'Average Interested People', data: avgInterest, backgroundColor: THEME.sec()
 }, // number[]
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: 'Location' },
        },
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Interested per Location',
        },
      },
    },
    plugins: [], // optional
  };

  return [interestedPerListing, interestedVsSize, interestedvsRent, intrestedVsLocation];
}


/*


    {
      title: "Interested per Location",
      type: "bar",
      data: {
        labels: locations,
        datasets: [
          { label: "Total Interested People", data: totalInterest },
          { label: "Average Interested People", data: avgInterest },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true },
          x: { title: { display: true, text: "Location" } },
        },
      },
    },

    */