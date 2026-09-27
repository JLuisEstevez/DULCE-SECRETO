# Dulce Secreto — Proyecto Full-Stack

Proyecto completo: frontend (React + Tailwind) y backend (Node.js + Express + SQLite)
100% conectados, con **dos sistemas de cuentas separados**: clientes (quien compra,
con foto de perfil e historial de pedidos) y staff (Kelly/editores, panel `/admin`
con roles).

**👉 Si es tu primera vez abriendo este proyecto, empieza por `GUIA-PASO-A-PASO.md`**,
ahí está explicado con calma qué es cada carpeta y cómo ejecutarlo.

## Stack
- **Frontend:** React 18 + Vite + React Router + Tailwind CSS
- **Backend:** Node.js + Express + SQLite (`better-sqlite3`) + bcryptjs + jsonwebtoken + Multer (subida de imágenes)

## Cómo correrlo (resumen rápido)

Terminal 1 — backend:
```bash
cd server
npm install
npm run dev
```

Terminal 2 — frontend:
```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. Ver `GUIA-PASO-A-PASO.md` para el detalle completo,
solución de errores comunes y un recorrido de prueba guiado.

## Estructura resumida
- `src/` → frontend (páginas, componentes, servicios de API)
- `server/` → backend (rutas REST, esquema SQL, base de datos SQLite, subida de comprobantes y fotos de perfil)

## Qué incluye cada prompt
- **Prompt 1:** arquitectura, paleta de marca, layout (Header/Footer).
- **Prompt 2:** catálogo (HU-01) y personalizador dinámico (HU-02).
- **Prompt 3:** checkout, información de pago y carga de comprobante (HU-03/HU-04).
- **Prompt 4:** dashboard administrativo con calendario y tablero Kanban (HU-05).
- **Prompt 5:** backend Express, esquema SQL, endpoints REST y conexión end-to-end.
- **Extra:** autenticación del panel de staff con roles (admin/editor) y sistema
  completo de cuentas de cliente (registro, login, foto de perfil, historial de
  pedidos).

## Próximos pasos sugeridos
Ver la sección 10 de `GUIA-PASO-A-PASO.md` (despliegue en internet, QR reales, fotos
reales de producto, recuperar contraseña, reordenar con un clic).

# DULCE-SECRETO
