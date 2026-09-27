# Guía Paso a Paso — Proyecto Dulce Secreto

Esta guía es para ti, Jose Luis. Está escrita pensando en que quizás es la primera vez
que corres un proyecto con frontend + backend por tu cuenta. Tómate tu tiempo, ve
sección por sección, y no pases a la siguiente hasta que la anterior te funcione.

---

## 1. ¿Qué es exactamente este proyecto?

Este proyecto tiene **dos programas separados que trabajan juntos**:

| Programa | Carpeta | Qué hace | Con qué se construyó |
|---|---|---|---|
| **Frontend** | `/src` (en la raíz) | Lo que el cliente ve y usa en el navegador: catálogo, personalizador, checkout, panel de Kelly | React + Tailwind CSS |
| **Backend** | `/server` | El "cerebro" que guarda los datos, calcula precios y responde peticiones | Node.js + Express + SQLite |

Piénsalo como un restaurante: el **frontend** es el salón y la carta que ve el cliente;
el **backend** es la cocina y la bodega, donde de verdad se preparan y almacenan las cosas.
Uno sin el otro no funciona completo: el frontend sin backend no tiene datos reales que
mostrar, y el backend sin frontend no tiene cómo mostrarse bonito.

**Por eso vas a necesitar dos terminales abiertas al mismo tiempo** cuando trabajes en
este proyecto: una para el backend y otra para el frontend. Lo explico en la Sección 4.

---

## 2. Mapa de carpetas: qué es cada cosa

```
dulce-secreto/
│
├── GUIA-PASO-A-PASO.md      ← Este documento que estás leyendo
├── README.md                 ← Resumen técnico corto del proyecto
├── package.json               ← Lista de dependencias del FRONTEND
├── index.html                 ← Punto de entrada HTML de la app
├── vite.config.js             ← Configuración del servidor de desarrollo
├── tailwind.config.js         ← Paleta de colores y tipografías de la marca
│
├── src/                        ← 🎨 TODO EL FRONTEND vive aquí
│   ├── main.jsx                 (arranca React)
│   ├── App.jsx                  (define las rutas/páginas: /, /catalogo, /admin, /cuenta/*, etc.)
│   ├── index.css                (estilos globales)
│   │
│   ├── pages/                   ← Una página completa por archivo
│   │   ├── Inicio.jsx              → página de bienvenida ("/")
│   │   ├── Catalogo.jsx            → catálogo de productos ("/catalogo")
│   │   ├── Personalizador.jsx      → configurar una torta ("/personalizar")
│   │   ├── Checkout.jsx            → formulario de entrega + pago ("/checkout")
│   │   ├── LoginCliente.jsx        → login del CLIENTE ("/cuenta/entrar")
│   │   ├── RegistroCliente.jsx     → registro del CLIENTE ("/cuenta/crear")
│   │   ├── PerfilCliente.jsx       → su perfil + foto ("/cuenta/perfil")
│   │   ├── MisPedidos.jsx          → su historial de pedidos ("/cuenta/pedidos")
│   │   ├── Login.jsx               → login del STAFF ("/login")
│   │   ├── Admin.jsx               → panel de Kelly ("/admin")
│   │   ├── Perfil.jsx              → perfil del STAFF ("/admin/perfil")
│   │   └── GestionUsuarios.jsx     → crear/eliminar cuentas de staff ("/admin/usuarios")
│   │
│   ├── context/                  ← DOS sistemas de sesión, completamente separados
│   │   ├── AuthContext.jsx          → sesión del STAFF (admin/editor)
│   │   └── ClienteAuthContext.jsx   → sesión del CLIENTE (quien compra)
│   │
│   ├── components/               ← Piezas reutilizables (botones, tarjetas, modales)
│   │   ├── Header.jsx / Footer.jsx / Layout.jsx
│   │   ├── RutaProtegida.jsx         → bloquea /admin si no hay sesión de STAFF
│   │   ├── RutaProtegidaCliente.jsx  → bloquea /cuenta/* si no hay sesión de CLIENTE
│   │   ├── AvatarPerfil.jsx          → foto de perfil circular, con carga de imagen
│   │   ├── TarjetaProducto.jsx, TarjetaPedido.jsx
│   │   ├── GrupoOpciones.jsx, GrupoToppings.jsx
│   │   ├── CargaComprobante.jsx, InformacionPago.jsx
│   │   ├── CalendarioPedidos.jsx, TableroKanban.jsx
│   │   └── ModalRevisionPedido.jsx
│   │
│   ├── services/
│   │   └── api.js                ← Llama al backend (fetch). Funciones "*Staff" y "*Cliente" separadas
│   │
│   ├── data/
│   │   └── pagos.js              ← Datos fijos de Nequi/Bancolombia (no cambian)
│   │
│   └── utils/                    ← Funciones auxiliares (formatear fechas, precios, etc.)
│
└── server/                      ← ⚙️ TODO EL BACKEND vive aquí
    ├── package.json                ← Lista de dependencias del BACKEND (distinta a la del frontend)
    ├── .env.example                ← Ejemplo de configuración (puerto, secreto de sesión, cuenta inicial)
    ├── uploads/
    │   ├── comprobantes/           ← Capturas de pago que suben los clientes al hacer un pedido
    │   └── perfiles/                ← Fotos de perfil que suben los clientes en su cuenta
    │
    └── src/
        ├── index.js                 ← Arranca el servidor
        ├── app.js                   ← Configura Express (rutas, CORS, manejo de errores)
        │
        ├── db/
        │   ├── schema.sql             ← Define las tablas de la base de datos
        │   ├── conexion.js            ← Abre la BD y migra sola bases de datos antiguas
        │   ├── semillas.js            ← Llena la BD con datos de ejemplo y crea la cuenta admin inicial
        │   └── dulce_secreto.sqlite   ← EL ARCHIVO DE BASE DE DATOS (se crea solo al arrancar)
        │
        ├── routes/                   ← Aquí están los endpoints (las "puertas" de la API)
        │   ├── productos.routes.js      → GET /api/productos
        │   ├── pedidos.routes.js        → POST /api/pedidos (vincula al cliente si hay sesión)
        │   ├── clientes.routes.js       → registro/login/perfil/foto/historial de CLIENTES
        │   ├── adminPedidos.routes.js   → GET y PATCH /api/admin/pedidos (requiere sesión STAFF)
        │   ├── auth.routes.js           → login/perfil del STAFF
        │   └── usuarios.routes.js       → gestión de cuentas de STAFF (requiere rol "admin")
        │
        ├── middleware/
        │   ├── upload.js              ← Reglas para subir comprobantes y fotos de perfil
        │   └── auth.js                ← requiereSesion('staff'|'cliente') + sesión opcional
        │
        └── utilidades/
            ├── codigoSeguimiento.js   ← Genera códigos tipo "DS-20260925-A1B2"
            └── token.js               ← Genera y valida el token de sesión (JWT), con su "tipo"
```

**Regla mental simple:** si vas a cambiar cómo se ve algo → entras a `/src`.
Si vas a cambiar cómo se calculan precios, se guardan pedidos o qué datos existen →
entras a `/server/src`.

---

## 3. Antes de empezar: instala lo necesario (una sola vez)

1. **Node.js** (incluye `npm`). Descárgalo de [nodejs.org](https://nodejs.org) — instala
   la versión **LTS** (la recomendada, no la "Current"). Para confirmar que quedó
   instalado, abre una terminal y escribe:
   ```bash
   node -v
   npm -v
   ```
   Si ves números de versión (ej. `v20.x.x`), estás listo.

2. **Un editor de código.** Recomendado: [Visual Studio Code](https://code.visualstudio.com/) (gratis).

3. **Google Chrome** (o cualquier navegador moderno) — ya lo tienes.

---

## 4. Cómo instalar y ejecutar el proyecto (paso a paso)

Vas a abrir **dos terminales**. En VS Code puedes abrir varias con el ícono `+` del panel
de terminal, o con el atajo `Ctrl + Ñ` / `Ctrl + \``.

### Paso 1 — Descomprime el proyecto
Descomprime el `.zip` en una carpeta que puedas encontrar fácilmente, por ejemplo
`Documentos/dulce-secreto`.

### Paso 2 — Terminal 1: instala y arranca el BACKEND

```bash
cd dulce-secreto/server
npm install
npm run dev
```

Espera a ver este mensaje:
```
Dulce Secreto API escuchando en http://localhost:4000
```

**Déjalo corriendo.** No cierres esta terminal. La primera vez que arranca, crea
automáticamente el archivo de base de datos (`dulce_secreto.sqlite`) y lo llena con
productos y pedidos de ejemplo, para que no empieces de cero.

### Paso 3 — Terminal 2: instala y arranca el FRONTEND

Abre una **segunda** terminal (sin cerrar la primera) y escribe:

```bash
cd dulce-secreto
npm install
npm run dev
```

Espera a ver algo como:
```
  ➜  Local:   http://localhost:5173/
```

Esto debería **abrir Chrome automáticamente** en `http://localhost:5173`. Si no se abre
solo, abre Chrome tú mismo y entra a esa dirección.

### ✅ Ya está corriendo
Si ambas terminales siguen abiertas y sin errores en rojo, el proyecto está 100% funcional:
puedes navegar el catálogo, personalizar una torta, hacer un pedido de prueba y verlo
aparecer en el panel de Kelly en `/admin`.

**Para la próxima vez que quieras trabajar**, repites solo el Paso 2 y el Paso 3
(ya no necesitas volver a hacer `npm install`, a menos que borres la carpeta
`node_modules` o instalemos una librería nueva más adelante).

**Para detener todo:** haz clic en cada terminal y presiona `Ctrl + C`.

---

## 5. Recorrido de prueba recomendado

Con las dos terminales corriendo y Chrome abierto en `http://localhost:5173`, prueba
el flujo completo en este orden — así validas que todo el sistema (frontend + backend +
base de datos) está realmente conectado:

1. **Inicio** → arriba a la derecha en el Header, clic en "Iniciar sesión" → luego en
   "Regístrate" → crea una cuenta de prueba (nombre, correo, contraseña).
   Quedas conectado automáticamente y el Header ahora muestra tu nombre.
2. Clic en tu nombre (arriba a la derecha) → entras a **"Mis pedidos"** → como es una
   cuenta nueva, verás "Todavía no tienes pedidos". Clic en "Mi perfil" y sube una foto
   (cualquier imagen de tu computador) para probar el avatar.
3. Vuelve al **Catálogo** (menú superior).
4. **Catálogo** → busca "chocolate", cambia de categoría, y clic en "Personalizar"
   sobre una torta.
5. **Personalizador** → elige porciones, sabor, relleno y un topping. Verás el precio
   cambiar en vivo. Clic en "Añadir al carrito / Ir a pago".
6. **Checkout** → como ya iniciaste sesión, verás el mensaje "Comprando como [tu
   nombre]" y tus datos ya vienen precargados. Llena el resto del formulario, copia el
   número de Nequi (botón "Copiar número"), y **sube cualquier imagen** como
   comprobante. Clic en "Confirmar pedido".
7. Verás la pantalla de confirmación con un **código de seguimiento** generado por el
   backend (ej. `DS-20260925-A1B2`).
8. Ve a **"Mis pedidos"** de nuevo (clic en tu nombre en el Header): ahora sí aparece el
   pedido que acabas de hacer, con su estado actual. Este historial es justamente lo
   que hace que valga la pena tener una cuenta de cliente.
9. Cierra esa sesión (botón en "Mi perfil") y haz un segundo pedido **sin** iniciar
   sesión, para comprobar que la compra como invitado sigue funcionando igual de bien
   (solo que ese pedido no aparecerá en ningún historial, por no estar ligado a una
   cuenta).
10. Ve al **footer** de cualquier página y haz clic en "Acceso administrativo". Como
    todavía no has iniciado sesión ahí (esta es una cuenta totalmente distinta a la de
    cliente), te manda a `/login`.
11. **Inicia sesión** con la cuenta que se crea sola la primera vez que arrancas el
    backend (mira el mensaje en la Terminal 1, o usa por defecto):
    - Correo: `kelly@dulcesecreto.co`
    - Contraseña: `dulcesecreto123`
12. En el panel verás tus dos pedidos de prueba en la columna **"Por Validar"** del
    tablero Kanban (uno con cuenta, otro de invitado). Haz clic sobre cualquiera: se
    abre el modal con el comprobante que subiste (la imagen real, no un ejemplo). Clic
    en **"Aprobar pago"**.
13. El pedido se mueve solo a la columna **"En Preparación"**. Arrástralo con el mouse
    entre columnas para simular el avance en cocina.
14. Cambia a la vista **"Calendario"** y comprueba que tus pedidos aparecen en el día
    que elegiste como fecha de entrega.
15. Arriba a la derecha del panel, clic en **"Usuarios"** → crea una cuenta nueva con
    rol "Editor" (por ejemplo para un ayudante de cocina) → cierra sesión → entra con
    esa cuenta nueva y comprueba que **no** puede ver la opción "Usuarios" (solo un
    "Administrador" puede gestionar cuentas).
16. Clic en **"Mi perfil"** (del panel de staff) y cambia tu nombre o tu contraseña.

Si todos estos pasos funcionaron, tu aplicación está **100% conectada de extremo a
extremo, con autenticación real**.

---

## 5.1 Sistema de cuentas de STAFF y roles (panel `/admin`)

El panel `/admin` ahora está protegido: nadie entra sin iniciar sesión. Hay dos roles:

| Rol | Puede... |
|---|---|
| **admin** | Todo: ver/gestionar pedidos, editar su perfil, y crear/eliminar otras cuentas administrativas |
| **editor** | Ver y gestionar pedidos (Kanban, calendario, aprobar/rechazar pagos) y editar su propio perfil. **No** puede crear ni eliminar otras cuentas |

**La primera cuenta (admin) se crea automáticamente** la primera vez que el backend
arranca y la base de datos está vacía. Sus credenciales por defecto son
`kelly@dulcesecreto.co` / `dulcesecreto123` — cámbialas cuanto antes desde
"Mi perfil" dentro del panel, o defínelas tú mismo antes del primer arranque copiando
`server/.env.example` a `server/.env` y editando `ADMIN_EMAIL_INICIAL` /
`ADMIN_PASSWORD_INICIAL`.

**¿Cómo funciona por dentro?** Al iniciar sesión, el backend responde con un "token"
(un texto firmado y con vencimiento de 8 horas, tecnología JWT) que el navegador guarda
en `localStorage`. Cada vez que el frontend pide algo del panel administrativo, envía
ese token; el backend lo revisa antes de responder. Por eso, si cierras sesión o pasan
más de 8 horas, tienes que volver a entrar con tu correo y contraseña.

⚠️ **Nota de seguridad para cuando esto salga de tu computador (producción):** copia
`server/.env.example` a `server/.env` y cambia `JWT_SECRET` por un texto largo y
aleatorio propio. Si ese archivo se sube a internet con el valor de ejemplo, cualquiera
podría fabricar sus propios tokens.

---

## 5.2 Sistema de cuentas de CLIENTES (quien compra)

Esto es un sistema **totalmente aparte** del panel `/admin` — no comparten usuarios,
contraseñas, ni siquiera el token de sesión (se guardan en llaves distintas del
navegador). Un cliente jamás puede entrar al panel de Kelly, y un token de staff jamás
sirve para ver "mis pedidos".

| Ruta | Qué hace |
|---|---|
| `/cuenta/crear` | Registro: nombre, correo, WhatsApp (opcional) y contraseña |
| `/cuenta/entrar` | Login del cliente |
| `/cuenta/perfil` | Editar nombre/correo/teléfono/contraseña, y subir foto de perfil |
| `/cuenta/pedidos` | Historial: todos los pedidos que ha hecho, con su estado actual |

**¿Cómo queda vinculado un pedido a la cuenta?** Si el cliente inició sesión antes de
llegar al Checkout, su pedido se guarda automáticamente ligado a su cuenta (columna
`cliente_id` en la tabla `pedidos`) y aparecerá en `/cuenta/pedidos`. Si compra **sin**
iniciar sesión (como invitado), el pedido se crea igual — solo que no quedará asociado
a ninguna cuenta y no aparecerá en ningún historial. En el Header (arriba a la derecha)
verás "Iniciar sesión" o, si ya entraste, tu foto/nombre con acceso directo a "Mis
pedidos".

**Foto de perfil:** se sube a `server/uploads/perfiles/` (separada de los comprobantes
de pago, que quedan en `server/uploads/comprobantes/`), con un límite de 3 MB.

---

## 6. ¿Cómo se comunican el frontend y el backend?

Esto es clave para que entiendas el proyecto y no solo lo copies:

- El backend expone datos en `http://localhost:4000/api/...` (por ejemplo,
  `http://localhost:4000/api/productos`).
- El frontend, en vez de escribir esa dirección larga en cada archivo, simplemente pide
  `/api/productos` (mira `src/services/api.js`).
- Un archivo de configuración (`vite.config.js`) tiene un **"proxy"**: le dice al
  frontend "cuando alguien pida algo que empiece por `/api`, mándaselo en secreto al
  backend en el puerto 4000". Así evitamos problemas de seguridad del navegador (CORS)
  durante el desarrollo.
- Esto **solo funciona si el backend (Terminal 1) está corriendo**. Si el catálogo
  aparece vacío o con un mensaje de error, lo primero que debes revisar es si esa
  terminal sigue abierta y sin errores.

---

## 7. ¿Dónde quedan guardados los datos?

- **Base de datos:** `server/src/db/dulce_secreto.sqlite`. Es un solo archivo (no
  necesitas instalar PostgreSQL ni nada externo). Puedes abrirlo con la extensión
  gratuita de VS Code "SQLite Viewer" si quieres ver las tablas.
- **Comprobantes de pago subidos:** `server/uploads/`. Cada imagen se guarda con un
  nombre único para no pisarse entre pedidos.
- **¿Quieres borrar todo y empezar de cero?** Con las terminales detenidas, borra el
  archivo `dulce_secreto.sqlite` (y los que empiecen igual, como `-wal` o `-shm` si
  existen) y la próxima vez que ejecutes `npm run dev` en el backend, se vuelve a crear
  con los datos de ejemplo desde cero.

---

## 8. Errores comunes y cómo resolverlos

| Mensaje o síntoma | Causa probable | Solución |
|---|---|---|
| El catálogo dice "No se pudieron cargar los productos" | El backend (Terminal 1) no está corriendo | Ve a `server/`, ejecuta `npm run dev` |
| `Error: listen EADDRINUSE: address already in use :::4000` | Ya tienes el backend corriendo en otra terminal, o algo más usa el puerto 4000 | Cierra la otra terminal, o cambia `PORT` en `server/.env` |
| `'vite' no se reconoce como un comando` / `command not found` | No corriste `npm install` en esa carpeta | Entra a la carpeta correcta y ejecuta `npm install` de nuevo |
| Chrome muestra "This site can't be reached" | El frontend (Terminal 2) no está corriendo, o cerraste la terminal | Ejecuta `npm run dev` en la raíz del proyecto |
| Subes el comprobante y da error "Solo se aceptan imágenes..." | El archivo no es PNG, JPG o WEBP | Usa una captura de pantalla normal (PNG o JPG) |
| "Correo o contraseña incorrectos" al entrar a `/login` | Escribiste mal el correo/contraseña, o borraste la base de datos y se creó una cuenta nueva | Revisa el mensaje que imprime la Terminal 1 del backend al arrancar: ahí muestra el correo y contraseña vigentes |
| El panel te devuelve solo a `/login` una y otra vez | El token de sesión expiró (dura 8 horas) o se corrompió | Vuelve a iniciar sesión normalmente |
| Cambié un archivo y no veo el cambio en Chrome | Poco común, pero pasa | Guarda el archivo (`Ctrl+S`) y revisa que no haya errores en la terminal del frontend; si persiste, refresca Chrome con `Ctrl+Shift+R` |

---

## 9. Cómo seguir trabajando en el proyecto

- **Cambios visuales** (colores, textos, tamaños): edita archivos dentro de `src/`,
  guarda, y Chrome se actualiza solo (esto se llama "hot reload").
- **Cambios de datos o reglas de negocio** (nuevos productos, nuevas reglas de precio,
  nuevos estados de pedido): edita archivos dentro de `server/src/`. El servidor se
  reinicia solo gracias a `npm run dev` (usa `node --watch`).
- **Agregar un producto nuevo de verdad:** por ahora, agrégalo en
  `server/src/db/semillas.js` (dentro del arreglo `PRODUCTOS`) y borra el archivo
  `.sqlite` para que se vuelva a sembrar. Más adelante, lo ideal es construir un
  formulario en el panel de admin para hacerlo sin tocar código.

---

## 10. Próximos pasos sugeridos

El documento maestro se cumplió: catálogo, personalizador, checkout, comprobantes,
dashboard, backend + base de datos, autenticación del staff con roles, **y ahora
cuentas de cliente con foto de perfil e historial de pedidos**, todo conectado de
extremo a extremo. Para llevar esto a un nivel de "producto real", lo siguiente que
normalmente seguiría es:

1. **Notificaciones automáticas** por WhatsApp cuando cambia el estado de un pedido
   (hoy Kelly tiene que avisar manualmente).
2. **Subir el proyecto a internet** (por ejemplo, frontend en Vercel/Netlify y backend
   en Render/Railway) para que no dependa de tu computador encendido. En ese momento,
   **no olvides cambiar `JWT_SECRET`** en el servidor real (ver sección 5.1), y usar
   almacenamiento externo para las fotos/comprobantes (`server/uploads/`) porque casi
   ningún hosting gratuito conserva archivos entre reinicios.
3. **QR reales** de Nequi/Bancolombia en vez del recuadro "QR" de ejemplo.
4. **Fotos reales de los productos** en vez de los íconos/emoji actuales
   (agregando el campo `imagen_url` que ya existe en la tabla `productos`).
5. **Recuperar contraseña** por correo, tanto para clientes como para staff, para
   cuando alguien la olvide.
6. **Reordenar un pedido anterior con un clic** desde "Mis pedidos", reutilizando la
   configuración guardada en `detalle_pedido.configuracion_json`.

No necesitas hacer esto ahora — es solo para que sepas qué preguntar o pedir en tu
próxima sesión con Claude cuando llegues a esa fase del proyecto.

---

## 11. Glosario rápido (por si te lo preguntan en sustentación)

- **Frontend:** la parte visual, lo que el usuario ve y toca en el navegador.
- **Backend:** el servidor que procesa datos, aplica reglas de negocio y habla con la
  base de datos.
- **API REST:** el "menú" de direcciones (endpoints) que el backend ofrece para que el
  frontend pida o envíe datos (ej. `GET /api/productos`).
- **Endpoint:** una dirección específica de la API (ej. `POST /api/pedidos`).
- **Base de datos:** donde se guardan permanentemente los datos (productos, pedidos).
  Aquí usamos SQLite, que guarda todo en un solo archivo.
- **JSON:** el formato de texto en el que el frontend y el backend se intercambian
  datos.
- **`npm install`:** descarga todas las librerías que el proyecto necesita para
  funcionar (solo se hace una vez, o cuando cambian las dependencias).
- **`npm run dev`:** enciende el proyecto en modo desarrollo (con recarga automática).
- **Proxy:** el "mensajero" que conecta al frontend con el backend durante el
  desarrollo sin que tengas que escribir la dirección completa cada vez.
- **JWT (JSON Web Token):** el "carnet" digital que recibes al iniciar sesión. El
  navegador lo guarda y lo muestra en cada petición al panel para probar quién eres,
  sin tener que escribir la contraseña cada vez. Vence solo después de 8 horas.
- **Hash de contraseña:** la contraseña nunca se guarda tal cual en la base de datos,
  sino "revuelta" con un algoritmo (bcrypt) que no se puede revertir. Así, ni siquiera
  alguien con acceso a la base de datos puede leer la contraseña real.
