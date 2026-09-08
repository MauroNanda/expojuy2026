export type Theme = "light" | "dark";

export const themeStorageKey = "expojuy-theme";

export function resolveTheme(
  storedTheme: string | null,
  prefersDark: boolean,
): Theme {
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return prefersDark ? "dark" : "light";
}

export function getBrowserTheme(): Theme {
  if (typeof window === "undefined") return "light";

  let storedTheme: string | null = null;
  try {
    storedTheme = window.localStorage.getItem(themeStorageKey);
  } catch {
    // A blocked storage API must not prevent the interface from rendering.
  }

  return resolveTheme(
    storedTheme,
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
}

export function applyThemeToDocument(theme: Theme) {
  if (typeof document === "undefined") return;

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}
