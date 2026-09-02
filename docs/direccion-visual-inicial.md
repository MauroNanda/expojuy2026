# Dirección visual inicial

## Propósito de la experiencia

ExpoJuy 2026 se presenta como un ecosistema productivo, tecnológico y de vinculación empresarial. Inicio debe ayudar primero a la persona visitante a descubrir sectores, protagonistas y experiencias; la planificación de la visita llega después.

## Tesis: Trama productiva

La página representa a la Expo como una red de relaciones: sectores que se encuentran, expositores que participan y experiencias que activan la visita. No representa un plano del predio ni una funcionalidad de mapa. La composición editorial usa nodos, conectores y bloques de contenido para hacer visible esa conexión sin inventar datos institucionales.

El elemento característico es una **trama productiva**: una composición adaptable de puntos y líneas que conecta contenidos reales de la interfaz. En Inicio acompaña el mensaje principal y se mantiene como recurso secundario; no sustituye títulos, enlaces, información ni controles.

## Sistema compacto de diseño

| Rol | Token | Valor inicial | Uso |
| --- | --- | --- | --- |
| Violeta institucional | `--color-brand-violet` | `#820CD0` | Acciones y énfasis principales. |
| Violeta de conexión | `--color-brand-indigo` | `#774FF0` | Trama, enlaces y estados interactivos. |
| Lila de expansión | `--color-brand-lilac` | `#BB8CFF` | Superficies y acentos de baja jerarquía. |
| Cian de experiencia | `--color-brand-cyan` | `#25C0D4` | Categorías y señales complementarias. |
| Grafito | `--color-ink` | `#4B4B4D` | Texto y estructura de alto contraste. |
| Gris institucional | `--color-neutral` | `#BDBFC1` | Bordes y contenido secundario. |
| Blanco | `--color-surface` | `#FFFFFF` | Fondo y contraste de lectura. |

Ambit es la familia tipográfica de interfaz. Sus pesos Regular y SemiBold resuelven lectura y controles; Bold se reserva para los titulares que nombran la propuesta de valor. Light se utiliza solo en apoyos de gran tamaño cuando el contraste sea suficiente.

La disposición parte de una columna editorial en móvil y abre una segunda zona para la trama en pantallas amplias. Las secciones se ordenan según el recorrido de descubrimiento: propuesta, sectores y experiencias, protagonistas, actividad, novedades y planificación. Los espacios, divisores y etiquetas de categoría organizan esa información; no se usan como ornamentación intercambiable.

## Criterio anti-genérico

La interfaz evita una landing de evento basada en fotografías de stock, métricas decorativas, tarjetas repetidas o degradados sin significado. Su identidad visual se construye con la tipografía y los colores oficiales, contenido vinculado a sectores y una trama que expresa relaciones del ecosistema. Si un recurso no puede relacionarse con la identidad oficial o con una información del evento, no se incorpora.

## Trazabilidad

- Propósito, audiencia y prioridad móvil: [visión](vision.md).
- Arquitectura de información y propuesta de Inicio: [decisiones](decisiones.md) (D-002 y D-009).
- Paleta inicial: [decisiones](decisiones.md) (D-010), extraída de los logotipos RGB oficiales.
- Tipografía y logotipos fuente: [identidad visual oficial](../assets/identidad/README.md).
- Alcance de Inicio y restricción de no simular capacidades pendientes: especificaciones `ecosystem-showcase-home` y `static-demo-shell` del store OpenSpec.

La paleta y la dirección pueden ajustarse si se incorpora un manual oficial de identidad o contenido institucional que lo requiera.
