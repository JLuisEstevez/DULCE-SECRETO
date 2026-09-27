import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const RUTA_BASE_DATOS = path.join(__dirname, 'dulce_secreto.sqlite')
const RUTA_ESQUEMA = path.join(__dirname, 'schema.sql')

export const db = new Database(RUTA_BASE_DATOS)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

const esquemaSQL = fs.readFileSync(RUTA_ESQUEMA, 'utf-8')
db.exec(esquemaSQL)

// Migraciones suaves: si ya tenías una base de datos de una versión anterior del
// proyecto (antes de que existiera esta columna/tabla), esto la pone al día sola,
// sin que tengas que borrar el archivo .sqlite cada vez que el proyecto crece.
function columnaExiste(tabla, columna) {
  return db.prepare(`PRAGMA table_info(${tabla})`).all().some((c) => c.name === columna)
}

function migrar(descripcion, fn) {
  try {
    fn()
  } catch (error) {
    console.warn(`Aviso de migración ("${descripcion}"): ${error.message}`)
  }
}

migrar('agregar pedidos.cliente_id', () => {
  if (!columnaExiste('pedidos', 'cliente_id')) {
    db.exec('ALTER TABLE pedidos ADD COLUMN cliente_id INTEGER REFERENCES clientes(id)')
  }
})

migrar('agregar usuarios_admin.nombre', () => {
  if (!columnaExiste('usuarios_admin', 'nombre')) {
    db.exec("ALTER TABLE usuarios_admin ADD COLUMN nombre TEXT NOT NULL DEFAULT 'Sin nombre'")
  }
})

// --- Login social (Google) ---

migrar('agregar clientes.proveedor_auth', () => {
  if (!columnaExiste('clientes', 'proveedor_auth')) {
    db.exec("ALTER TABLE clientes ADD COLUMN proveedor_auth TEXT NOT NULL DEFAULT 'local'")
  }
})

migrar('agregar clientes.proveedor_id', () => {
  if (!columnaExiste('clientes', 'proveedor_id')) {
    db.exec('ALTER TABLE clientes ADD COLUMN proveedor_id TEXT')
  }
})

// SQLite no permite "ALTER COLUMN ... DROP NOT NULL" directamente. Si la base de
// datos es de una versión anterior (password_hash NOT NULL), reconstruimos la
// tabla completa preservando todos los datos, para que las cuentas de Google
// (que no tienen contraseña) puedan guardarse con password_hash = NULL.
migrar('relajar clientes.password_hash a NULL', () => {
  const info = db.prepare('PRAGMA table_info(clientes)').all()
  const columnaPassword = info.find((c) => c.name === 'password_hash')
  if (!columnaPassword || columnaPassword.notnull === 0) return // ya está bien, nada que hacer

  db.transaction(() => {
    db.exec(`
      CREATE TABLE clientes_nueva (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre         TEXT NOT NULL,
        email          TEXT UNIQUE NOT NULL,
        password_hash  TEXT,
        telefono       TEXT,
        foto_url       TEXT,
        proveedor_auth TEXT NOT NULL DEFAULT 'local' CHECK (proveedor_auth IN ('local', 'google')),
        proveedor_id   TEXT,
        creado_en      TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)
    db.exec(`
      INSERT INTO clientes_nueva (id, nombre, email, password_hash, telefono, foto_url, proveedor_auth, proveedor_id, creado_en)
      SELECT id, nombre, email, password_hash, telefono, foto_url, proveedor_auth, proveedor_id, creado_en FROM clientes
    `)
    db.exec('DROP TABLE clientes')
    db.exec('ALTER TABLE clientes_nueva RENAME TO clientes')
  })()
})

export function contarFilas(tabla) {
  return db.prepare(`SELECT COUNT(*) AS total FROM ${tabla}`).get().total
}
