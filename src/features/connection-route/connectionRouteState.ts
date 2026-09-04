export const connectionRouteLimit = 3;

export type AddActorToRouteResult = {
  actorIds: string[];
  kind: "added" | "already-selected" | "limit-reached" | "unknown-actor";
};

export function addActorToRoute(
  actorIds: string[],
  actorId: string,
  availableActorIds: string[],
): AddActorToRouteResult {
  if (!availableActorIds.includes(actorId)) {
    return { actorIds, kind: "unknown-actor" };
  }
  if (actorIds.includes(actorId)) {
    return { actorIds, kind: "already-selected" };
  }
  if (actorIds.length >= connectionRouteLimit) {
    return { actorIds, kind: "limit-reached" };
  }

  return { actorIds: [...actorIds, actorId], kind: "added" };
}

export function removeActorFromRoute(
  actorIds: string[],
  actorId: string,
): string[] {
  return actorIds.filter((candidateId) => candidateId !== actorId);
}

export function clearConnectionRoute(): string[] {
  return [];
}
