import { createContext } from "react";

import type { AddActorToRouteResult } from "./connectionRouteState";

export type ConnectionRouteAction =
  AddActorToRouteResult["kind"] | "removed" | "cleared";

export interface ConnectionRouteContextValue {
  actorIds: string[];
  announcement: string;
  addActor: (actorId: string) => ConnectionRouteAction;
  clearRoute: () => void;
  connectionRouteLimit: number;
  removeActor: (actorId: string) => void;
}

export const ConnectionRouteContext =
  createContext<ConnectionRouteContextValue | null>(null);
