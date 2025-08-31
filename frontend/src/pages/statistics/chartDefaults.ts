
import "./chartSetup"

import { Themes } from "@shared/themes";
import { Chart } from "chart.js";
import type { Align, CartesianTickOptions } from "chart.js";

import type { BarControllerDatasetOptions } from 'chart.js';

const hexToRgba = (hex: string, alpha = 1) => {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getCSSVar = (varName: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || "#000";

export const THEME = {
  pri: (alpha: number = 1) => hexToRgba(getCSSVar("--pri"), alpha),
  sec: (alpha: number = 1) => hexToRgba(getCSSVar("--sec"), alpha),
  onbg: (alpha: number = 1) => hexToRgba(getCSSVar("--onbg"), alpha),
  oncard: (alpha: number = 1) => hexToRgba(getCSSVar("--oncard"), alpha),
  fontTitle: () => getCSSVar("--font-title")
};

export function refreshAllCharts() {
  Object.values(Chart.instances).forEach((chart: any) => {
    chart.update();
  });
}

export function applyChartTheme(theme: Themes) {

  Chart.defaults.font.family = "Arial, sans-serif";
  Chart.defaults.font.size = 14;
  Chart.defaults.color = "onbg";

  Chart.defaults.plugins.legend.labels.color = THEME.onbg();
  Chart.defaults.plugins.legend.labels.font = {
    family: "Arial, sans-serif",
    size: 14,
  };

  Chart.defaults.plugins.title = {
    ...Chart.defaults.plugins.title,
    color: THEME.oncard(),
    align: "start",
    font: {
      ...Chart.defaults.plugins.title?.font,
      size: 18,
      weight: "bold",
      family: THEME.fontTitle(),
    },
  };

  Chart.defaults.scales.category = {
    ...Chart.defaults.scales.category,
    title: {
      ...Chart.defaults.scales.category.title,
      display: true,
      color: THEME.oncard()
    },
    grid: { color: THEME.oncard(0.25) },
    ticks: {
      ...Chart.defaults.scales.category.ticks,
      color: THEME.oncard(),
    }
  };


  Chart.defaults.scales.linear = {
    ...Chart.defaults.scales.linear,
    grid: { color: THEME.oncard(0.25) },
    title: {
      ...Chart.defaults.scales.linear.title,
      color: THEME.oncard()
    },
    ticks: {
      ...Chart.defaults.scales.linear.ticks,
      color: THEME.oncard()
    },
  };


  Chart.defaults.elements.bar.backgroundColor = '#ff0000';
  Chart.defaults.elements.bar.borderColor = 'rgba(0,0,0,0)';
  Chart.defaults.elements.bar.borderWidth = 1;
  Chart.defaults.elements.bar.borderRadius = 4;
  Chart.defaults.elements.bar.borderSkipped = false;
}