import type { Apartment } from "@shared/types";
import type { ChartConfiguration } from "chart.js";

import { THEME } from "./chartDefaults"


/**
 * Generate chart configurations for rent statistics
 * @param apartments Array of Apartment objects
 */
export function getCharts(apartments: Apartment[]) {
  const barChart: ChartConfiguration<'bar', number, string> = {
    type: 'bar',
    data: {
      labels: apartments.map(a => a.address), // string[]
      datasets: [
        {
          label: 'Rent',
          data: apartments.map(a => a.rent_krPerMonth), // number[]
          backgroundColor: THEME.pri()
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { title: { display: true, text: 'Rent per Listing' } },
      scales: {
        x: { type: 'category', min: 5 }, // force string labels
        y: { beginAtZero: true }
      }
    }
  };



  // Scatter chart type-safe
  const scatterChart: ChartConfiguration<'scatter', { x: number; y: number }[], never> = {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Size vs Rent',
          data: apartments.map(a => ({ x: a.size_sqrM, y: a.rent_krPerMonth })),
          backgroundColor: THEME.pri()
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { title: { display: true, text: 'Size vs Rent' } },
      scales: {
        x: { type: 'linear', title: { display: true, text: 'Size (m²)' } },
        y: { type: 'linear', title: { display: true, text: 'Rent (kr/mån)' } }
      }
    }
  };

  // Combine them for return
  return [barChart, scatterChart];
}


/*

{
      title: "Rent per Listing",
      type: "bar",
      data: {
        labels: apartments.map((a) => a.address),
        datasets: [
          {
            label: "Rent (kr/mån)",
            data: apartments.map((a) => a.rent_krPerMonth),
          },
        ],
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } },
    },
    {
      title: "Size vs Rent",
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Size vs Rent",
            data: apartments.map((a) => ({
              x: a.size_sqrM,
              y: a.rent_krPerMonth,
            })),
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: "Size (m²)" } },
          y: { title: { display: true, text: "Rent (kr/mån)" }, beginAtZero: true },
        },
      },
    },
    {
      title: "Floor vs Rent",
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Floor vs Rent",
            data: apartments.map((a) => ({
              x: a.floor.floor,
              y: a.rent_krPerMonth,
            })),
          },
        ],
      },
      options: {
        responsive: true
      },
    },

    */