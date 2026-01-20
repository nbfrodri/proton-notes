# Guía de Despliegue en Vercel

Esta guía te ayudará a desplegar la versión web de tu aplicación **Proton Notes** en Vercel.

## Preparación del Proyecto

Ya hemos configurado los archivos necesarios para asegurar compatibilidad:

1.  **`vercel.json`**: Configurado para manejar las rutas de la Single Page Application (SPA).
2.  **`vite.config.ts`**: Actualizado para ajustar automáticamente la ruta base (`base`) dependiendo de si estás en Vercel (`/`) o en Electron (`./`).

## Pasos para Desplegar

### Opción 1: Importar desde GitHub (Recomendado)

1.  Asegúrate de que tu código esté subido a tu repositorio en GitHub.
2.  Inicia sesión en [Vercel](https://vercel.com).
3.  Haz clic en **"Add New..."** -> **"Project"**.
4.  Selecciona tu repositorio (**proton-notes** o el nombre que tenga).
5.  En la configuración del proyecto:
    - **Framework Preset**: Vercel debería detectar **Vite** automáticamente.
    - **Root Directory**: Déjalo en `./` (la raíz).
    - **Build Command**: `npm run build` (o el default de Vite).
    - **Output Directory**: `dist` (default de Vite).
6.  Haz clic en **Deploy**.

### Notas Adicionales

- **Variables de Entorno**: Vercel define automáticamente la variable `VERCEL=1`, lo cual activa nuestra configuración en `vite.config.ts` para usar rutas absolutas, asegurando que la aplicación web funcione correctamente.
- **Electron**: Este despliegue es solo para la versión Web. La versión de escritorio (Electron) se construye localmente usando `npm run dist`.
