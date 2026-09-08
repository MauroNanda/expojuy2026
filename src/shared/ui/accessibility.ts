export type TextSize = "normal" | "large";

export type AccessibilityPreferences = {
  textSize: TextSize;
  highContrast: boolean;
};

export const accessibilityStorageKey = "expojuy-a11y";

export const defaultPreferences: AccessibilityPreferences = {
  textSize: "normal",
  highContrast: false,
};

export function resolveAccessibilityPreferences(
  storedPrefs: string | null,
): AccessibilityPreferences {
  if (storedPrefs) {
    try {
      const parsed = JSON.parse(storedPrefs);
      return {
        textSize: parsed.textSize === "large" ? "large" : "normal",
        highContrast: !!parsed.highContrast,
      };
    } catch {
      return defaultPreferences;
    }
  }
  return defaultPreferences;
}

export function getBrowserAccessibilityPreferences(): AccessibilityPreferences {
  if (typeof window === "undefined") return defaultPreferences;

  let storedPrefs: string | null = null;
  try {
    storedPrefs = window.localStorage.getItem(accessibilityStorageKey);
  } catch {
    // A blocked storage API must not prevent the interface from rendering.
  }

  return resolveAccessibilityPreferences(storedPrefs);
}

export function applyAccessibilityToDocument(prefs: AccessibilityPreferences) {
  if (typeof document === "undefined") return;

  if (prefs.textSize === "large") {
    document.documentElement.classList.add("a11y-text-large");
  } else {
    document.documentElement.classList.remove("a11y-text-large");
  }

  if (prefs.highContrast) {
    document.documentElement.classList.add("a11y-high-contrast");
  } else {
    document.documentElement.classList.remove("a11y-high-contrast");
  }
}
