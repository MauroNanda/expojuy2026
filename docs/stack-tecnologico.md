# Stack tecnológico

## Frontend

- React.
- TypeScript.
- Vite.
- Publicación estática en GitHub Pages.

El frontend debe separar componentes de interfaz, acceso a datos y experiencias de navegador como la realidad aumentada.

## Realidad aumentada

- MindAR Image Tracking.
- A-Frame.
- Three.js.

MindAR utiliza targets de imagen compilados con extensión `.mind`. La experiencia se ejecuta del lado del navegador y requiere permiso explícito de cámara. La integración concreta entre las tres librerías se definirá en el change específico de realidad aumentada.

## Plataforma funcional proyectada

- ASP.NET Core 10 para la API.
- PostgreSQL para datos institucionales, agenda, expositores, mapa, noticias y formularios.
- OpenAPI para describir contratos HTTP entre frontend y backend.

La API y la base de datos no forman parte de la publicación estática inicial. El frontend debe poder reemplazar datos de demostración por una API sin modificar su interfaz pública.

## Licencias y costos

React, Vite, MindAR, Three.js, A-Frame, .NET y PostgreSQL permiten uso sin licencias comerciales obligatorias. Antes de incorporar cada dependencia o recurso, verificar su licencia, mantenimiento, tamaño y costo operativo.
