# Dirección visual inicial

## Propósito de la experiencia

ExpoJuy 2026 se presenta como un ecosistema productivo, tecnológico y de vinculación empresarial. Inicio debe ayudar primero a la persona visitante a descubrir sectores, protagonistas y experiencias; la planificación de la visita llega después.

## Tesis: Trama productiva

La página representa a la Expo como una red de relaciones: sectores que se encuentran, expositores que participan y experiencias que activan la visita. No representa un plano del predio ni una funcionalidad de mapa. La composición editorial usa ámbitos y bloques de contenido para hacer visible esa conexión sin inventar datos institucionales.

El elemento característico es una **trama productiva integrada en el titular**: una composición editorial adaptable que expresa producción, ideas y oportunidades una sola vez mediante tipografía, ritmo y color. El énfasis en oportunidades conecta visualmente el mensaje con el beneficio del recorrido. Producción local, Tecnología aplicada y Vinculación empresarial aparecen como etiquetas secundarias que la relacionan con los sectores reales. No se duplica el titular en un panel complementario ni se construye una segunda lista de sectores; las etiquetas no funcionan como selector ni mapa.

Como contrapeso del titular, el hero incorpora una única ilustración demostrativa: **El recorrido que se revela**. Un camino continuo atraviesa tres momentos simbólicos —oficio y producto local, tecnología aplicada y encuentro entre proyectos— para anticipar el recorrido que la interfaz permite construir. No es un mapa, diagrama ni representación de un evento real; aporta contexto y presencia sin trasladar información necesaria a una imagen. En móvil aparece después de la acción principal para priorizar lectura y comienzo del recorrido.

## Sistema compacto de diseño

| Rol                   | Token                  | Valor inicial | Uso                                      |
| --------------------- | ---------------------- | ------------- | ---------------------------------------- |
| Violeta institucional | `--color-brand-violet` | `#820CD0`     | Acciones y énfasis principales.          |
| Violeta de conexión   | `--color-brand-indigo` | `#774FF0`     | Trama, enlaces y estados interactivos.   |
| Lila de expansión     | `--color-brand-lilac`  | `#BB8CFF`     | Superficies y acentos de baja jerarquía. |
| Cian de experiencia   | `--color-brand-cyan`   | `#25C0D4`     | Categorías y señales complementarias.    |
| Grafito               | `--color-ink`          | `#4B4B4D`     | Texto y estructura de alto contraste.    |
| Gris institucional    | `--color-neutral`      | `#BDBFC1`     | Bordes y contenido secundario.           |
| Blanco                | `--color-surface`      | `#FFFFFF`     | Fondo y contraste de lectura.            |

Ambit es la familia tipográfica de interfaz. Sus pesos Regular y SemiBold resuelven lectura y controles; Bold se reserva para los titulares que nombran la propuesta de valor. Light se utiliza solo en apoyos de gran tamaño cuando el contraste sea suficiente.

La disposición parte de un único titular editorial. Debajo, fecha y sede preceden a la explicación y la acción de exploración; estos apoyos comparten una fila de dos columnas en pantallas amplias y se apilan en móvil. Los sectores cierran el hero como etiquetas secundarias compactas. La escala tipográfica responde al ancho disponible, con interlineado legible y sin mínimos intrínsecos que desborden el contenedor. Las secciones se ordenan según el recorrido de descubrimiento: propuesta, sectores y experiencias, protagonistas, actividad, novedades y planificación. Los espacios, divisores y etiquetas de categoría organizan esa información; no se usan como ornamentación intercambiable.

## Criterio anti-genérico

La interfaz evita una landing de evento basada en fotografías de stock, métricas decorativas, tarjetas repetidas o degradados sin significado. Su identidad visual se construye con la tipografía y los colores oficiales, contenido vinculado a sectores, una trama que expresa relaciones del ecosistema y una ilustración demostrativa que anticipa el recorrido. La ilustración puede extender la paleta con tonos territoriales moderados siempre que violeta, cian y grafito preserven el vínculo con la identidad. Si un recurso no puede relacionarse con la identidad oficial o con una información del evento, no se incorpora.

## Trazabilidad

- Propósito, audiencia y prioridad móvil: [visión](vision.md).
- Arquitectura de información y propuesta de Inicio: [decisiones](decisiones.md) (D-002 y D-009).
- Paleta inicial: [decisiones](decisiones.md) (D-010), extraída de los logotipos RGB oficiales.
- Tipografía y logotipos fuente: [identidad visual oficial](../assets/identidad/README.md).
- Alcance de Inicio y restricción de no simular capacidades pendientes: especificaciones `ecosystem-showcase-home` y `static-demo-shell` del store OpenSpec.

La paleta y la dirección pueden ajustarse si se incorpora un manual oficial de identidad o contenido institucional que lo requiera.
