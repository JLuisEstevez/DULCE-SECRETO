-- Esquema de base de datos de Dulce Secreto.
-- Escrito para SQLite (usado por este backend), con tipos simples
-- fácilmente adaptables a PostgreSQL/Supabase si el proyecto migra más adelante.

CREATE TABLE IF NOT EXISTS productos (
  id             TEXT PRIMARY KEY,
  nombre         TEXT NOT NULL,
  categoria      TEXT NOT NULL,
  precio_base    INTEGER NOT NULL,
  descripcion    TEXT,
  imagen_url     TEXT,
  personalizable INTEGER NOT NULL DEFAULT 0 -- 0 = no, 1 = sí (tortas a medida)
);

CREATE TABLE IF NOT EXISTS opciones_personalizacion (
  id              TEXT PRIMARY KEY,
  tipo            TEXT NOT NULL CHECK (tipo IN ('porcion', 'sabor', 'relleno', 'topping')),
  nombre          TEXT NOT NULL,
  costo_adicional INTEGER NOT NULL DEFAULT 0,
  factor          REAL -- solo se usa en tipo 'porcion': multiplica el precio_base
);

-- Cuentas de clientes (front-office): pueden ver su historial de pedidos.
-- Es un sistema de cuentas TOTALMENTE SEPARADO de usuarios_admin (staff/cocina).
CREATE TABLE IF NOT EXISTS clientes (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre         TEXT NOT NULL,
  email          TEXT UNIQUE NOT NULL,
  password_hash  TEXT, -- NULL si la cuenta se creó por login social (Google) y nunca puso contraseña propia
  telefono       TEXT,
  foto_url       TEXT,
  proveedor_auth TEXT NOT NULL DEFAULT 'local' CHECK (proveedor_auth IN ('local', 'google')),
  proveedor_id   TEXT, -- UID único entregado por Google (sub del token) cuando proveedor_auth = 'google'
  creado_en      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pedidos (
  id                 TEXT PRIMARY KEY,
  cliente_id         INTEGER REFERENCES clientes(id), -- NULL = pedido de invitado (sin cuenta)
  codigo_seguimiento TEXT UNIQUE NOT NULL,
  cliente_nombre     TEXT NOT NULL,
  telefono           TEXT NOT NULL,
  direccion          TEXT NOT NULL,
  fecha_entrega      TEXT NOT NULL,
  notas              TEXT,
  producto_resumen   TEXT NOT NULL,
  total              INTEGER NOT NULL,
  estado_pedido      TEXT NOT NULL DEFAULT 'Por Validar'
                       CHECK (estado_pedido IN ('Por Validar', 'En Preparación', 'Horneando', 'Entregado')),
  estado_pago        TEXT NOT NULL DEFAULT 'Pendiente'
                       CHECK (estado_pago IN ('Pendiente', 'Aprobado', 'Rechazado')),
  comprobante_url    TEXT,
  creado_en          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS detalle_pedido (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido_id           TEXT NOT NULL REFERENCES pedidos(id),
  producto_id         TEXT NOT NULL REFERENCES productos(id),
  configuracion_json  TEXT NOT NULL,
  subtotal            INTEGER NOT NULL
);

-- Usuarios que pueden entrar al panel administrativo (login + gestión de usuarios).
CREATE TABLE IF NOT EXISTS usuarios_admin (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre        TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  rol           TEXT NOT NULL DEFAULT 'admin' CHECK (rol IN ('admin', 'editor')),
  creado_en     TEXT NOT NULL DEFAULT (datetime('now'))
);
