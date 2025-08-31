
export const getCSSVar = (varName: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || "#000";

