import { useMemo, useState, type ReactNode } from "react";

import { demoExhibitors } from "../../content/demoContent";
import {
  ConnectionRouteContext,
  type ConnectionRouteAction,
  type ConnectionRouteContextValue,
} from "./connectionRouteContext";
import {
  addActorToRoute,
  clearConnectionRoute,
  connectionRouteLimit,
  removeActorFromRoute,
} from "./connectionRouteState";

const availableActorIds = demoExhibitors.map((exhibitor) => exhibitor.id);

function describeAction(
  action: ConnectionRouteAction,
  actorName?: string,
): string {
  switch (action) {
    case "added":
      return `${actorName ?? "El actor"} se sumó a tu Ruta de conexiones.`;
    case "removed":
      return `${actorName ?? "El actor"} se quitó de tu Ruta de conexiones.`;
    case "cleared":
      return "Tu Ruta de conexiones está vacía.";
    case "already-selected":
      return `${actorName ?? "El actor"} ya forma parte de tu Ruta de conexiones.`;
    case "limit-reached":
      return `Tu Ruta de conexiones ya tiene ${connectionRouteLimit} actores. Quitá uno para sumar otro.`;
    case "unknown-actor":
      return "Ese actor no está disponible en el recorrido de demostración.";
  }
}

interface ConnectionRouteProviderProps {
  children: ReactNode;
}

export function ConnectionRouteProvider({
  children,
}: ConnectionRouteProviderProps) {
  const [actorIds, setActorIds] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState(
    "Tu Ruta de conexiones está vacía.",
  );

  const value = useMemo<ConnectionRouteContextValue>(() => {
    function addActor(actorId: string): ConnectionRouteAction {
      const actor = demoExhibitors.find(
        (exhibitor) => exhibitor.id === actorId,
      );
      const result = addActorToRoute(actorIds, actorId, availableActorIds);

      setAnnouncement(describeAction(result.kind, actor?.name));
      if (result.kind === "added") {
        setActorIds(result.actorIds);
      }

      return result.kind;
    }

    function removeActor(actorId: string) {
      const actor = demoExhibitors.find(
        (exhibitor) => exhibitor.id === actorId,
      );

      setActorIds((currentActorIds) =>
        removeActorFromRoute(currentActorIds, actorId),
      );
      setAnnouncement(describeAction("removed", actor?.name));
    }

    function clearRoute() {
      setActorIds(clearConnectionRoute());
      setAnnouncement(describeAction("cleared"));
    }

    return {
      actorIds,
      announcement,
      addActor,
      clearRoute,
      connectionRouteLimit,
      removeActor,
    };
  }, [actorIds, announcement]);

  return (
    <ConnectionRouteContext.Provider value={value}>
      {children}
    </ConnectionRouteContext.Provider>
  );
}
