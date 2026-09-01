# Realidad aumentada

## Alcance

La realidad aumentada utiliza exclusivamente seguimiento de imágenes mediante MindAR Image Tracking y emplea MindAR, A-Frame y Three.js. La composición técnica de estas librerías se definirá en un change específico.

## Requisitos técnicos

- Cada target se compila como archivo `.mind` y se versiona junto con su imagen fuente autorizada.
- La experiencia incorpora MindAR, A-Frame y Three.js.
- La cámara se inicia únicamente después de una acción explícita de la persona usuaria.
- Al cerrar la experiencia se detienen la cámara, la animación y el renderizador.
- La interfaz debe informar el estado de carga, permiso, detección del target y errores.
- Debe existir contenido alternativo cuando no se otorgue permiso o no exista compatibilidad.

## Fuera de alcance

- Seguimiento facial.
- Seguimiento de superficie o mundo.
- Geolocalización.
- Captura o envío de imágenes a servicios externos.

## Activos

Los modelos 3D, imágenes, audio y demás recursos deben ser propios, institucionales o contar con una licencia compatible y verificable.
