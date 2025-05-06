// src/theme/mode.ts

let currentMode: "light" | "dark" = "light";

export function setTheme(mode: "light" | "dark") {
  currentMode = mode;
  document.documentElement.setAttribute("data-theme", mode);
}

export function getTheme() {
  return currentMode;
}
