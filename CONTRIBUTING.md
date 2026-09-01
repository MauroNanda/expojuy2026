# Guía de contribución

## Fuente de verdad y OpenSpec

- El store OpenSpec `sdd-open-spec-expojuy2026` contiene las especificaciones funcionales vigentes y las propuestas de cambio en revisión; una propuesta no modifica el comportamiento vigente hasta su aprobación.
- `docs/` contiene decisiones, criterios y documentación de arquitectura.
- Una capacidad nueva o una modificación funcional requiere una propuesta OpenSpec aprobada antes de implementarse.
- Todo cambio funcional debe incluir requisitos verificables y escenarios de aceptación.
- Los cambios de arquitectura, datos, seguridad, realidad aumentada o integraciones externas deben incluir un diseño técnico.
- Al completar un cambio, actualizar las especificaciones vigentes y archivar su propuesta.
- Las correcciones tipográficas, de formato o de enlaces no requieren una propuesta OpenSpec.

## Estándares de código

- Usar TypeScript con modo estricto en frontend y C# con nulabilidad habilitada en backend.
- Mantener componentes, módulos y servicios con una responsabilidad clara.
- Preferir composición y reutilización antes que duplicar lógica.
- Mantener interfaces y modelos explícitos en los límites entre módulos.
- No incorporar dependencias sin justificar su necesidad, licencia, mantenimiento y costo operativo.
- Versionar los archivos de bloqueo de dependencias.
- No introducir código muerto, valores mágicos sin nombre, `TODO` sin referencia, `console.log` de depuración ni bloques de código comentados.
- Ejecutar formateador, linter, verificación de tipos y pruebas disponibles antes de integrar cambios.
- Mantener la compatibilidad con publicación estática en GitHub Pages mientras el frontend no requiera servicios de servidor.

## Comentarios y documentación de código

- Comentar decisiones, restricciones, invariantes y motivos no evidentes.
- No comentar instrucciones que el código ya expresa con claridad.
- Documentar contratos públicos, configuraciones no obvias y límites de seguridad.
- Mantener los comentarios actualizados junto con el código.
- Cuando una explicación afecte a más de un módulo, documentarla en el store OpenSpec o `docs/`, no solo dentro del código.

## Seguridad y privacidad

- Nunca versionar secretos, contraseñas, tokens, claves API, certificados ni archivos de entorno con valores reales.
- Validar toda entrada en el backend; el frontend no constituye una barrera de seguridad.
- Aplicar mínimos privilegios a cuentas, credenciales y servicios.
- Limitar CORS a los orígenes autorizados cuando exista API.
- Tratar contenido externo y contenido administrable como no confiable hasta validarlo o sanitizarlo.
- Revisar vulnerabilidades y licencias de dependencias antes de publicar.
- No enviar imágenes, video ni datos de cámara a servicios externos sin consentimiento visible y una decisión documentada.
- La experiencia de realidad aumentada debe liberar cámara, renderizador y recursos al finalizar; debe existir una alternativa sin cámara.

## Accesibilidad y calidad de interfaz

- Diseñar con prioridad móvil y verificar funcionamiento en pantallas pequeñas.
- Permitir navegación por teclado y foco visible.
- Mantener contraste suficiente, semántica HTML, etiquetas comprensibles y textos alternativos para contenido significativo.
- No depender únicamente de color, cámara, movimiento o gestos para transmitir información esencial.
- Proveer alternativas para funciones que requieran permisos del dispositivo.

## Inteligencia artificial

- La IA puede asistir en investigación, documentación, diseño, código y validación.
- Todo resultado generado debe ser revisado y validado antes de integrarse.
- No inventar información institucional, requisitos ni contenido presentado como oficial.
- Registrar las herramientas de IA y su finalidad en `docs/uso-de-ia.md` cuando corresponda.
- Verificar licencias, seguridad y coherencia antes de incorporar contenido o código generado.

## Integración de cambios

- Mantener los cambios pequeños, trazables y relacionados con una única especificación o corrección.
- Actualizar pruebas, especificaciones y documentación que resulten afectadas.
- No incluir cambios no relacionados en la misma contribución.
- Informar limitaciones conocidas y decisiones pendientes en la documentación correspondiente.
