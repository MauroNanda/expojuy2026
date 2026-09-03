import { useCallback, useState } from "react";

/**
 * La selección se conserva únicamente en el dispositivo. No hay cuentas ni
 * servidor: la clave incluye una versión para poder cambiar el formato sin
 * arrastrar datos incompatibles de visitas anteriores.
 */
const STORAGE_KEY = "expojuy2026:agenda-seleccion:v1";

/**
 * Toda lectura del almacenamiento se trata como no confiable: puede estar
 * bloqueado por la configuración del navegador, vacío, corrupto o contener
 * actividades que ya no existen. En cualquiera de esos casos la Agenda debe
 * presentarse con una selección vacía en lugar de interrumpirse.
 */
function readStoredSelection(availableIds: readonly string[]): string[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (id): id is string => typeof id === "string" && availableIds.includes(id),
    );
  } catch {
    return [];
  }
}

function writeStoredSelection(selectedIds: readonly string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
  } catch {
    // Conservar la selección es una comodidad, no un requisito del recorrido:
    // si el almacenamiento no está disponible la Agenda sigue operando.
  }
}

export function useAgendaSelection(availableIds: readonly string[]) {
  // La lectura ocurre una sola vez al inicializar el estado. La aplicación se
  // publica como sitio estático sin renderizado en servidor, de modo que el
  // almacenamiento ya está disponible en el primer render.
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    readStoredSelection(availableIds),
  );

  const toggle = useCallback((id: string) => {
    setSelectedIds((current) => {
      const next = current.includes(id)
        ? current.filter((selected) => selected !== id)
        : [...current, id];
      writeStoredSelection(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSelectedIds([]);
    writeStoredSelection([]);
  }, []);

  return { clear, selectedIds, toggle };
}
