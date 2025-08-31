import type { ChartConfiguration } from "chart.js";
import type { Apartment } from "@shared/types";

import { THEME } from "./chartDefaults";

export function getCharts(apartments: Apartment[]) {

  const releasedPerWeekConfig: ChartConfiguration<'bar', number, string> = {
    type: 'bar',
    data: {
      labels: (() => {
        const weeks = apartments.map(a => getYearWeek(a.published));
        return Array.from(new Set(weeks)).sort();
      })(),
      datasets: [
        {
          label: 'Apartments Released per Week',
          data: (() => {
            const weekCounts: Record<string, number> = {};
            for (const a of apartments) {
              const week = getYearWeek(a.published);
              weekCounts[week] = (weekCounts[week] || 0) + 1;
            }
            const weeks = Array.from(new Set(apartments.map(a => getYearWeek(a.published)))).sort();
            return weeks.map(w => weekCounts[w]);
          })(),
          backgroundColor: THEME.pri(),
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Apartments Released per Week',
        },
      },
      scales: {
        x: {
          type: 'category',
          title: {
            display: true,
            text: 'Week',
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Count',
          },
        },
      },
    },
  };


  const config: ChartConfiguration<'bar', number, string> = {
    type: 'bar',
    data: (() => {
      const leadTimes = apartments.map(a => {
        const pub = new Date(a.published);
        const move = new Date(a.move_in);
        return Math.round((move.getTime() - pub.getTime()) / (1000 * 60 * 60 * 24));
      });

      const leadCount: Record<number, number> = {};
      for (const days of leadTimes) leadCount[days] = (leadCount[days] || 0) + 1;

      const labels = Object.keys(leadCount).map(Number).sort((a, b) => a - b);
      const counts = labels.map(d => leadCount[d]);

      return {
        labels: labels.map(d => `${d} days`),
        datasets: [
          {
            label: 'Number of Apartments',
            data: counts,
            backgroundColor: THEME.pri()
          },
        ],
      };
    })(),
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Published vs Move-in Lead Time',
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Lead Time (days)',
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Count',
          },
        },
      },
    },
  };

  return [releasedPerWeekConfig, config];
}

/*

    {
      title: "Published vs Move-in Lead Time",
      type: "bar",
      data: (() => {
        const leadTimes = apartments.map((a) => {
          const pub = new Date(a.published);
          const move = new Date(a.move_in);
          return Math.round((move.getTime() - pub.getTime()) / (1000 * 60 * 60 * 24));
        });
        const leadCount: Record<number, number> = {};
        for (const days of leadTimes) leadCount[days] = (leadCount[days] || 0) + 1;

        const labels = Object.keys(leadCount).map(Number).sort((a, b) => a - b);
        const counts = labels.map((d) => leadCount[d]);

        return {
          labels: labels.map((d) => `${d} days`),
          datasets: [{ label: "Number of Apartments", data: counts }],
        };
      })(),
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: "Lead Time (days)" } },
          y: { beginAtZero: true, title: { display: true, text: "Count" } },
        },
      },
    },

    */

// Helper to get week string
function getYearWeek(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getUTCFullYear();
  const tmp = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${year}-W${weekNum}`;
}
