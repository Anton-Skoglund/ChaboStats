// src/stores/theme.ts
import { writable } from "svelte/store";

// Read initial value from localStorage or default to false (light mode)
const initial = localStorage.getItem("darkMode") === "true";

export const darkMode = writable(initial);

// Subscribe and persist changes to localStorage
darkMode.subscribe((value) => {
  localStorage.setItem("darkMode", value.toString());

  // Optional: toggle `dark` class on <html> for Tailwind
  if (value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
});
