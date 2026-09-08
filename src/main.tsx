import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { App } from "./app/App";
import { applyThemeToDocument, getBrowserTheme } from "./shared/ui/theme";
import "./styles/global.css";

applyThemeToDocument(getBrowserTheme());

const redirectedPath = new URLSearchParams(window.location.search).get("redirect");
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

if (
  redirectedPath &&
  (redirectedPath === basePath || redirectedPath.startsWith(`${basePath}/`))
) {
  window.history.replaceState(null, "", redirectedPath);
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se encontró el elemento raíz de la aplicación.");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
