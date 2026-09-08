import { type ReactNode, useEffect, useState } from "react";
import {
  applyAccessibilityToDocument,
  getBrowserAccessibilityPreferences,
  accessibilityStorageKey,
  type AccessibilityPreferences,
  type TextSize,
} from "./accessibility";
import { AccessibilityContext } from "./accessibilityContext";

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() =>
    getBrowserAccessibilityPreferences(),
  );

  useEffect(() => {
    applyAccessibilityToDocument(preferences);
    try {
      window.localStorage.setItem(
        accessibilityStorageKey,
        JSON.stringify(preferences),
      );
    } catch {
      // Ignored
    }
  }, [preferences]);

  const setTextSize = (size: TextSize) => {
    setPreferences((prev) => ({ ...prev, textSize: size }));
  };

  const toggleHighContrast = () => {
    setPreferences((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  };

  return (
    <AccessibilityContext.Provider
      value={{ preferences, setTextSize, toggleHighContrast }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}
