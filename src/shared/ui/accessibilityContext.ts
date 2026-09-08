import { createContext } from "react";
import type { AccessibilityPreferences, TextSize } from "./accessibility";

export type AccessibilityContextValue = {
  preferences: AccessibilityPreferences;
  setTextSize: (size: TextSize) => void;
  toggleHighContrast: () => void;
};

export const AccessibilityContext =
  createContext<AccessibilityContextValue | null>(null);
