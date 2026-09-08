import type {
  ConnectionRouteSnapshot,
  ExportedActor,
} from "./connectionRouteExportModel.ts";

const expojuyLogoUrl = new URL(
  "../../assets/brand/expojuy26_horizontal.png",
  import.meta.url,
).href;
const venueMapUrl = new URL(
  "../../assets/map/venue-aerial.png",
  import.meta.url,
).href;

import { venueMapZones, type VenueMapZone } from "../../content/demoContent.ts";

export interface PdfAssetOverrides {
  logoBytes?: Uint8Array | null;
  mapBytes?: Uint8Array | null;
  zones?: VenueMapZone[];
}

/**
 * Sanitiza caracteres que no están presentes en la codificación WinAnsi estándar
 * de Helvetica en PDF, asegurando que el documento nunca falle al serializar texto.
 */
export function sanitizePdfText(text: string): string {
  if (!text) return "";
  return text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, "-")
    .replace(/[•]/g, "-")
    .replace(/[·]/g, "|")
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/gu, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim();
}

/**
 * Carga los bytes binarios de un asset mediante fetch en navegador o filesystem en Node.
 */
async function loadAssetBytes(assetUrl: string): Promise<Uint8Array | null> {
  try {
    if (typeof fetch === "function") {
      const res = await fetch(assetUrl);
      if (res && res.ok) {
        const buffer = await res.arrayBuffer();
        return new Uint8Array(buffer);
      }
    }
  } catch {
    // Si falla el fetch (ej. protocolo file:// en Node) se intenta fallback
  }

  try {
    const dynamicImport = new Function("modulePath", "return import(modulePath)");
    const fs = await dynamicImport("node:fs/promises");
    const { fileURLToPath } = await dynamicImport("node:url");
    const filePath = assetUrl.startsWith("file://")
      ? fileURLToPath(assetUrl)
      : assetUrl;
    const buf = await fs.readFile(filePath);
    return new Uint8Array(buf);
  } catch {
    // Si no se puede cargar la imagen, se continúa sin ella
  }

  return null;
}

/**
 * Genera el archivo binario PDF (Uint8Array) con maquetado editorial, mapa del predio,
 * logotipo oficial y estética unificada con la aplicación web.
 */
export async function generateRoutePdfBytes(
  snapshot: ConnectionRouteSnapshot,
  assetOverrides?: PdfAssetOverrides,
): Promise<Uint8Array> {
  if (!snapshot.isValid || snapshot.actors.length === 0) {
    throw new Error(
      snapshot.emptyReason ?? "No hay protagonistas en el recorrido para exportar.",
    );
  }

  // Carga diferida de pdf-lib bajo demanda
  const { PDFDocument, StandardFonts, rgb, PDFString, degrees } = await import("pdf-lib");

  const doc = await PDFDocument.create();
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  // Cargar imágenes de identidad y mapa
  const logoBytes =
    assetOverrides?.logoBytes !== undefined
      ? assetOverrides.logoBytes
      : await loadAssetBytes(expojuyLogoUrl);

  const mapBytes =
    assetOverrides?.mapBytes !== undefined
      ? assetOverrides.mapBytes
      : await loadAssetBytes(venueMapUrl);

  let embeddedLogo: any = null;
  if (logoBytes && logoBytes.length > 0) {
    try {
      embeddedLogo = await doc.embedPng(logoBytes);
    } catch {
      // Ignorar fallo de imagen y continuar con texto
    }
  }

  let embeddedMap: any = null;
  if (mapBytes && mapBytes.length > 0) {
    try {
      embeddedMap = await doc.embedPng(mapBytes);
    } catch {
      // Ignorar fallo de imagen y continuar con texto
    }
  }

  const pageWidth = 595.28; // A4
  const pageHeight = 841.89;
  const margin = 36;
  const contentWidth = pageWidth - margin * 2; // 523.28

  const pages: Array<ReturnType<typeof doc.addPage>> = [];
  let currentPage = doc.addPage([pageWidth, pageHeight]);
  pages.push(currentPage);
  let y = pageHeight - 40;

  function ensureSpace(neededHeight: number) {
    if (y - neededHeight < 55) {
      currentPage = doc.addPage([pageWidth, pageHeight]);
      pages.push(currentPage);
      y = pageHeight - 45;
    }
  }

  // Helper para registrar un vínculo interactivo sin el subrayado azul estridente
  function registerDiscreetLink(
    x: number,
    yPos: number,
    width: number,
    height: number,
    url: string,
  ) {
    if (!url) return;
    try {
      const annot = doc.context.obj({
        Type: "Annot",
        Subtype: "Link",
        Rect: [x, yPos, x + width, yPos + height],
        Border: [0, 0, 0],
        A: {
          Type: "Action",
          S: "URI",
          URI: PDFString.of(url),
        },
      });
      currentPage.node.addAnnot(doc.context.register(annot));
    } catch {
      // Continuar si falla la anotación
    }
  }

  // =========================================================================
  // 1. CABECERA INSTITUCIONAL (Logo + Datos del evento)
  // =========================================================================
  const headerHeight = 60;
  if (embeddedLogo) {
    // Escalar logo respetando proporción (ancho ~125, alto ~54)
    const logoW = 125;
    const logoH = (logoW / embeddedLogo.width) * embeddedLogo.height;
    currentPage.drawImage(embeddedLogo, {
      x: margin,
      y: y - logoH + 4,
      width: logoW,
      height: logoH,
    });
  } else {
    // Fallback de texto si no hay logo disponible
    currentPage.drawText("EXPOJUY 2026", {
      x: margin,
      y: y - 10,
      font: fontBold,
      size: 18,
      color: rgb(0.51, 0.05, 0.82),
    });
  }

  // Datos oficiales a la derecha
  const rightColX = 305;

  // Pastilla de edición
  const editionStr = sanitizePdfText(`${snapshot.edition}.ª EDICIÓN OFICIAL`);
  currentPage.drawText(editionStr, {
    x: rightColX,
    y: y - 4,
    font: fontBold,
    size: 8.5,
    color: rgb(0.51, 0.05, 0.82),
  });

  // Período confirmado
  const periodStr = sanitizePdfText(snapshot.confirmedPeriod);
  currentPage.drawText(periodStr, {
    x: rightColX,
    y: y - 18,
    font: fontBold,
    size: 10,
    color: rgb(0.12, 0.12, 0.16),
  });

  // Sede confirmada
  const venueStr = sanitizePdfText(snapshot.confirmedVenue);
  currentPage.drawText(venueStr, {
    x: rightColX,
    y: y - 30,
    font: fontRegular,
    size: 8.5,
    color: rgb(0.35, 0.35, 0.4),
  });

  if (snapshot.directionsUrl) {
    registerDiscreetLink(
      rightColX,
      y - 32,
      fontRegular.widthOfTextAtSize(venueStr, 8.5),
      11,
      snapshot.directionsUrl,
    );
  }

  // Fecha de emisión
  const emittedStr = sanitizePdfText(`Generado: ${snapshot.generatedAt}`);
  currentPage.drawText(emittedStr, {
    x: rightColX,
    y: y - 42,
    font: fontRegular,
    size: 7.5,
    color: rgb(0.5, 0.5, 0.55),
  });

  y -= headerHeight + 5;

  // Barra de acento con los dos colores oficiales de marca (violeta + cian)
  const barBreak = margin + 350;
  currentPage.drawLine({
    start: { x: margin, y },
    end: { x: barBreak, y },
    thickness: 2.2,
    color: rgb(0.51, 0.05, 0.82),
  });
  currentPage.drawLine({
    start: { x: barBreak, y },
    end: { x: margin + contentWidth, y },
    thickness: 2.2,
    color: rgb(0.15, 0.75, 0.83),
  });

  y -= 20;

  // Título de la guía
  currentPage.drawText(sanitizePdfText(snapshot.title), {
    x: margin,
    y,
    font: fontBold,
    size: 15,
    color: rgb(0.12, 0.12, 0.18),
  });
  y -= 13;

  currentPage.drawText(
    "Guía de recorrido personalizada con expositores, ubicaciones en el predio y actividades asociadas.",
    {
      x: margin,
      y,
      font: fontRegular,
      size: 8.5,
      color: rgb(0.42, 0.42, 0.48),
    },
  );
  y -= 22;

  // =========================================================================
  // 2. SECCIÓN PRINCIPAL A DOS COLUMNAS (Protagonistas + Plano del Predio)
  // =========================================================================
  const col1Width = 270;
  const col2X = margin + col1Width + 14;
  const col2Width = contentWidth - col1Width - 14; // ~239 pt

  // Columna Izquierda: Protagonistas seleccionados
  currentPage.drawText("1. Protagonistas seleccionados", {
    x: margin,
    y,
    font: fontBold,
    size: 11,
    color: rgb(0.12, 0.12, 0.18),
  });

  // Columna Derecha: Título del plano
  currentPage.drawText("2. Plano del Predio y Zonas", {
    x: col2X,
    y,
    font: fontBold,
    size: 11,
    color: rgb(0.12, 0.12, 0.18),
  });

  const sectionTopY = y - 12;

  // --- Renderizado Columna Derecha: Imagen del mapa + Zonas destacadas + Referencias ---
  let rightBottomY = sectionTopY;
  if (embeddedMap) {
    const mapH = 145;
    const mapY = sectionTopY - mapH;
    currentPage.drawImage(embeddedMap, {
      x: col2X,
      y: mapY,
      width: col2Width,
      height: mapH,
    });

    // Marco elegante alrededor del plano
    currentPage.drawRectangle({
      x: col2X,
      y: mapY,
      width: col2Width,
      height: mapH,
      borderColor: rgb(0.85, 0.85, 0.9),
      borderWidth: 0.8,
    });

    // Agrupar actores del recorrido por ID de zona
    const zoneActorsMap = new Map<
      string,
      Array<{ actor: ExportedActor; num: string }>
    >();
    snapshot.actors.forEach((actor, idx) => {
      if (actor.zoneId) {
        const num = String(idx + 1).padStart(2, "0");
        const list = zoneActorsMap.get(actor.zoneId) ?? [];
        list.push({ actor, num });
        zoneActorsMap.set(actor.zoneId, list);
      }
    });

    const activeZones = assetOverrides?.zones ?? venueMapZones;

    // Dibujar las zonas sobre el plano aéreo
    for (const zone of activeZones) {
      const selectedInRoute = zoneActorsMap.get(zone.id);
      const isRouteZone = Boolean(selectedInRoute && selectedInRoute.length > 0);

      let fillColor: any;
      let fillOpacity: number;
      let strokeColor: any;
      let strokeWidth: number;
      let strokeOpacity: number;

      if (isRouteZone) {
        strokeColor = rgb(0.15, 0.75, 0.83); // Cian de marca destacado
        strokeWidth = 1.8;
        strokeOpacity = 0.95;

        switch (zone.kind) {
          case "covered":
            fillColor = rgb(0.51, 0.05, 0.82); // Violeta institucional
            fillOpacity = 0.42;
            break;
          case "outdoor":
            fillColor = rgb(1.0, 0.48, 0.0); // Naranja
            fillOpacity = 0.42;
            break;
          case "artisan":
            fillColor = rgb(1.0, 0.78, 0.18); // Dorado artesano
            fillOpacity = 0.48;
            break;
          case "food":
          default:
            fillColor = rgb(0.15, 0.75, 0.83); // Cian
            fillOpacity = 0.45;
            break;
        }
      } else {
        // Zonas no seleccionadas: contorno sutil para contextualizar el predio
        fillColor = rgb(0.9, 0.92, 0.96);
        fillOpacity = 0.08;
        strokeColor = rgb(0.72, 0.75, 0.8);
        strokeWidth = 0.5;
        strokeOpacity = 0.35;
      }

      zone.areas.forEach((area, areaIdx) => {
        const rectW = (area.width / 100) * col2Width;
        const rectH = (area.height / 100) * mapH;
        const rawX = col2X + (area.left / 100) * col2Width;
        const rawY = mapY + (1 - (area.top + area.height) / 100) * mapH;

        let drawX = rawX;
        let drawY = rawY;
        let rotateOpt: any = undefined;

        if (area.rotation) {
          const rotDeg = -area.rotation;
          const theta = (rotDeg * Math.PI) / 180;
          const cx = rawX + rectW / 2;
          const cy = rawY + rectH / 2;
          const ox = (rectW / 2) * Math.cos(theta) - (rectH / 2) * Math.sin(theta);
          const oy = (rectW / 2) * Math.sin(theta) + (rectH / 2) * Math.cos(theta);
          drawX = cx - ox;
          drawY = cy - oy;
          rotateOpt = degrees(rotDeg);
        }

        currentPage.drawRectangle({
          x: drawX,
          y: drawY,
          width: rectW,
          height: rectH,
          color: fillColor,
          opacity: fillOpacity,
          borderColor: strokeColor,
          borderWidth: strokeWidth,
          borderOpacity: strokeOpacity,
          rotate: rotateOpt,
        });

        // Insignia de parada en la primera área de la zona seleccionada
        if (isRouteZone && areaIdx === 0 && selectedInRoute) {
          const badgeText = selectedInRoute.map((item) => item.num).join(", ");
          const textW = fontBold.widthOfTextAtSize(badgeText, 7);
          const badgeW = Math.max(16, textW + 7);
          const badgeH = 11.5;

          const cx = rawX + rectW / 2;
          const cy = rawY + rectH / 2;
          const badgeX = Math.max(
            col2X + 2,
            Math.min(col2X + col2Width - badgeW - 2, cx - badgeW / 2),
          );
          const badgeY = Math.max(
            mapY + 2,
            Math.min(mapY + mapH - badgeH - 2, cy - badgeH / 2),
          );

          currentPage.drawRectangle({
            x: badgeX,
            y: badgeY,
            width: badgeW,
            height: badgeH,
            color: rgb(0.51, 0.05, 0.82),
            borderColor: rgb(1, 1, 1),
            borderWidth: 1,
            opacity: 0.95,
          });

          currentPage.drawText(badgeText, {
            x: badgeX + (badgeW - textW) / 2,
            y: badgeY + 2.8,
            font: fontBold,
            size: 7,
            color: rgb(1, 1, 1),
          });
        }
      });
    }

    // Cuadro de referencias y ubicación debajo del plano
    const uniqueRouteZones = Array.from(zoneActorsMap.entries());
    const legendH = uniqueRouteZones.length >= 3 ? 68 : 58;
    const legendY = mapY - 8;

    currentPage.drawRectangle({
      x: col2X,
      y: legendY - legendH,
      width: col2Width,
      height: legendH,
      color: rgb(0.97, 0.98, 1.0),
      borderColor: rgb(0.85, 0.89, 0.95),
      borderWidth: 0.75,
    });

    currentPage.drawText("Ubicación de tus paradas en el plano:", {
      x: col2X + 8,
      y: legendY - 11,
      font: fontBold,
      size: 7.5,
      color: rgb(0.2, 0.45, 0.65),
    });

    let lY = legendY - 22;
    uniqueRouteZones.slice(0, 3).forEach(([zId, items]) => {
      const zoneDef = activeZones.find((z) => z.id === zId);
      const zLabel = zoneDef?.label ?? items[0]?.actor?.zoneLabel ?? "Zona ferial";
      const nums = items.map((i) => i.num).join(", ");
      const names = items.map((i) => i.actor.name).join(", ");
      const text = sanitizePdfText(`[${nums}] ${zLabel}: ${names}`);
      const truncated = text.length > 50 ? `${text.slice(0, 48)}...` : text;
      currentPage.drawText(truncated, {
        x: col2X + 8,
        y: lY,
        font: fontRegular,
        size: 7,
        color: rgb(0.25, 0.25, 0.3),
      });
      lY -= 10.5;
    });

    // Fila con enlace directo a Google Maps
    const mapsLinkY = legendY - legendH + 8;
    const mapsText = sanitizePdfText("Ciudad Cultural: Como llegar en Google Maps ->");

    // Pequeño indicador circular estilo pin
    currentPage.drawCircle({
      x: col2X + 11,
      y: mapsLinkY + 2.5,
      size: 2.2,
      color: rgb(0.12, 0.42, 0.75),
    });

    currentPage.drawText(mapsText, {
      x: col2X + 17,
      y: mapsLinkY,
      font: fontBold,
      size: 7,
      color: rgb(0.12, 0.42, 0.75),
    });

    if (snapshot.directionsUrl) {
      registerDiscreetLink(
        col2X + 8,
        mapsLinkY - 2,
        fontBold.widthOfTextAtSize(mapsText, 7) + 12,
        10,
        snapshot.directionsUrl,
      );
    }

    rightBottomY = legendY - legendH;
  }

  // --- Renderizado Columna Izquierda: Tarjetas de los protagonistas ---
  let leftY = sectionTopY;
  const cardHeight = 60;

  for (let i = 0; i < snapshot.actors.length; i++) {
    const actor: ExportedActor = snapshot.actors[i];
    const topCard = leftY;

    // Fondo de la tarjeta
    currentPage.drawRectangle({
      x: margin,
      y: topCard - cardHeight,
      width: col1Width,
      height: cardHeight,
      color: rgb(0.98, 0.98, 0.99),
      borderColor: rgb(0.88, 0.88, 0.92),
      borderWidth: 0.75,
    });

    // Insignia con el número
    const num = String(i + 1).padStart(2, "0");
    currentPage.drawRectangle({
      x: margin + 8,
      y: topCard - 18,
      width: 17,
      height: 13,
      color: rgb(0.51, 0.05, 0.82),
    });
    currentPage.drawText(num, {
      x: margin + 11,
      y: topCard - 15,
      font: fontBold,
      size: 7.5,
      color: rgb(1, 1, 1),
    });

    // Nombre del protagonista
    const nameText = sanitizePdfText(actor.name);
    currentPage.drawText(nameText, {
      x: margin + 30,
      y: topCard - 15,
      font: fontBold,
      size: 9.5,
      color: rgb(0.1, 0.1, 0.15),
    });

    // Registrar enlace invisible sobre el nombre para consultar ficha web si lo desean
    if (actor.actorUrl) {
      registerDiscreetLink(
        margin + 30,
        topCard - 17,
        fontBold.widthOfTextAtSize(nameText, 9.5),
        12,
        actor.actorUrl,
      );
    }

    // Sector y Territorio
    const sectorPart = actor.sectorName ? `Sector: ${actor.sectorName}` : "";
    const terrPart = actor.territory ? ` | ${actor.territory}` : "";
    const metaText = sanitizePdfText(`${sectorPart}${terrPart}`);
    if (metaText) {
      currentPage.drawText(metaText, {
        x: margin + 10,
        y: topCard - 29,
        font: fontRegular,
        size: 7.5,
        color: rgb(0.42, 0.42, 0.48),
      });
    }

    // Zona en plano
    const zoneStr = actor.zoneLabel
      ? `Ubicación en plano: ${actor.zoneLabel}`
      : "Ubicación: En asignación";
    currentPage.drawText(sanitizePdfText(zoneStr), {
      x: margin + 10,
      y: topCard - 42,
      font: fontBold,
      size: 7.5,
      color: rgb(0.15, 0.55, 0.65), // Cian suave institucional
    });

    if (actor.zoneUrl) {
      registerDiscreetLink(
        margin + 10,
        topCard - 44,
        fontBold.widthOfTextAtSize(zoneStr, 7.5),
        10,
        actor.zoneUrl,
      );
    }

    // Actividad vinculada
    if (actor.activityTitle) {
      const actStr = sanitizePdfText(`Actividad: ${actor.activityTitle}`);
      const truncatedAct = actStr.length > 48 ? `${actStr.slice(0, 46)}...` : actStr;
      currentPage.drawText(truncatedAct, {
        x: margin + 10,
        y: topCard - 53,
        font: fontRegular,
        size: 7,
        color: rgb(0.3, 0.3, 0.35),
      });

      if (actor.activityUrl) {
        registerDiscreetLink(
          margin + 10,
          topCard - 55,
          fontRegular.widthOfTextAtSize(truncatedAct, 7),
          9,
          actor.activityUrl,
        );
      }
    }

    leftY -= cardHeight + 6;
  }

  // Ajustar Y para la siguiente sección al punto más bajo de ambas columnas
  y = Math.min(leftY, rightBottomY) - 15;

  // =========================================================================
  // 3. AGENDA DE ACTIVIDADES DEL RECORRIDO (Itinerario cronológico)
  // =========================================================================
  if (snapshot.activities.length > 0) {
    ensureSpace(60);

    // Divisor fino
    currentPage.drawLine({
      start: { x: margin, y: y + 8 },
      end: { x: margin + contentWidth, y: y + 8 },
      thickness: 0.75,
      color: rgb(0.88, 0.88, 0.92),
    });

    currentPage.drawText("3. Agenda de actividades vinculadas al recorrido", {
      x: margin,
      y: y - 5,
      font: fontBold,
      size: 11,
      color: rgb(0.12, 0.12, 0.18),
    });
    y -= 20;

    for (const act of snapshot.activities) {
      ensureSpace(42);

      const rowH = 34;
      currentPage.drawRectangle({
        x: margin,
        y: y - rowH,
        width: contentWidth,
        height: rowH,
        color: rgb(0.985, 0.985, 0.995),
        borderColor: rgb(0.89, 0.89, 0.93),
        borderWidth: 0.6,
      });

      // Cabecera: Fecha, horario y título
      const headerStr = sanitizePdfText(
        `${act.date} | ${act.time} hs (${act.durationMinutes} min) - ${act.title}`,
      );
      currentPage.drawText(headerStr, {
        x: margin + 10,
        y: y - 12,
        font: fontBold,
        size: 8.5,
        color: rgb(0.15, 0.15, 0.2),
      });

      if (act.activityUrl) {
        registerDiscreetLink(
          margin + 10,
          y - 14,
          fontBold.widthOfTextAtSize(headerStr, 8.5),
          12,
          act.activityUrl,
        );
      }

      // Detalle: Lugar y protagonistas
      const detailStr = sanitizePdfText(
        `Lugar: ${act.location}  |  Protagonistas: ${act.relatedActorNames.join(", ")}`,
      );
      const truncatedDetail =
        detailStr.length > 115 ? `${detailStr.slice(0, 112)}...` : detailStr;
      currentPage.drawText(truncatedDetail, {
        x: margin + 10,
        y: y - 24,
        font: fontRegular,
        size: 7.5,
        color: rgb(0.4, 0.4, 0.45),
      });

      y -= rowH + 6;
    }
  }

  y -= 8;

  // =========================================================================
  // 4. AVISO DEMOSTRATIVO INSTITUCIONAL
  // =========================================================================
  ensureSpace(50);
  const noticeH = 38;
  currentPage.drawRectangle({
    x: margin,
    y: y - noticeH,
    width: contentWidth,
    height: noticeH,
    color: rgb(0.99, 0.985, 0.96),
    borderColor: rgb(0.92, 0.88, 0.78),
    borderWidth: 0.75,
  });

  currentPage.drawText("Aviso importante sobre este recorrido:", {
    x: margin + 10,
    y: y - 11,
    font: fontBold,
    size: 7.5,
    color: rgb(0.55, 0.38, 0.1),
  });

  const noticeText = sanitizePdfText(
    `${snapshot.notice} Documento personal demostrativo no operativo. No constituye reserva, inscripción ni acceso asegurado.`,
  );

  const maxChars = 118;
  const line1 =
    noticeText.length > maxChars
      ? noticeText.slice(0, noticeText.lastIndexOf(" ", maxChars))
      : noticeText;
  const line2 =
    noticeText.length > maxChars ? noticeText.slice(line1.length + 1) : "";

  currentPage.drawText(line1, {
    x: margin + 10,
    y: y - 22,
    font: fontRegular,
    size: 7,
    color: rgb(0.42, 0.38, 0.3),
  });

  if (line2) {
    currentPage.drawText(line2, {
      x: margin + 10,
      y: y - 31,
      font: fontRegular,
      size: 7,
      color: rgb(0.42, 0.38, 0.3),
    });
  }

  // =========================================================================
  // 5. PIE DE PÁGINA EDITORIAL
  // =========================================================================
  const totalPages = pages.length;
  pages.forEach((p, idx) => {
    p.drawLine({
      start: { x: margin, y: 34 },
      end: { x: margin + contentWidth, y: 34 },
      thickness: 0.5,
      color: rgb(0.88, 0.88, 0.92),
    });

    const footerLeft = sanitizePdfText(
      "ExpoJuy 2026 | Catálogo y mapa interactivo en expojuy.jujuy.gob.ar",
    );
    p.drawText(footerLeft, {
      x: margin,
      y: 22,
      font: fontRegular,
      size: 7.5,
      color: rgb(0.5, 0.5, 0.55),
    });

    const pageNumText = `Página ${idx + 1} de ${totalPages}`;
    const pageNumW = fontRegular.widthOfTextAtSize(pageNumText, 7.5);
    p.drawText(pageNumText, {
      x: margin + contentWidth - pageNumW,
      y: 22,
      font: fontRegular,
      size: 7.5,
      color: rgb(0.5, 0.5, 0.55),
    });
  });

  return doc.save();
}

/**
 * Genera y dispara la descarga del archivo PDF en el navegador.
 */
export async function downloadRoutePdf(
  snapshot: ConnectionRouteSnapshot,
  filename = "recorrido-expojuy-2026.pdf",
): Promise<void> {
  const bytes = await generateRoutePdfBytes(snapshot);
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 2000);
}
