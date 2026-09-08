import { type ReactNode, useEffect, useState } from "react";
import {
  applyThemeToDocument,
  getBrowserTheme,
  themeStorageKey,
  type Theme,
} from "./theme";
import { ThemeContext } from "./themeContext";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => getBrowserTheme());

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      try {
        window.localStorage.setItem(themeStorageKey, nextTheme);
      } catch {
        // The chosen mode remains active for this session when storage is blocked.
      }
      return nextTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
