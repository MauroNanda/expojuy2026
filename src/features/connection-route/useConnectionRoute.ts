import { useContext } from "react";

import {
  ConnectionRouteContext,
  type ConnectionRouteContextValue,
} from "./connectionRouteContext";

export function useConnectionRoute(): ConnectionRouteContextValue {
  const context = useContext(ConnectionRouteContext);

  if (!context) {
    throw new Error(
      "useConnectionRoute debe usarse dentro de ConnectionRouteProvider.",
    );
  }

  return context;
}
