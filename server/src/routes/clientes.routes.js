import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { db } from '../db/conexion.js'
import { generarToken } from '../utilidades/token.js'
import { requiereSesion } from '../middleware/auth.js'
import { subirFotoPerfil } from '../middleware/upload.js'
import { verificarTokenGoogle } from '../utilidades/googleAuth.js'

const router = Router()

function clientePublico(fila) {
  if (!fila) return null
  const { password_hash, ...resto } = fila
  return resto
}

// POST /api/clientes/registro
router.post('/registro', (req, res) => {
  const { nombre, email, password, telefono } = req.body

  if (!nombre?.trim() || !email?.trim() || !password) {
    res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios.' })
    return
  }
  if (password.length < 8) {
    res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' })
    return
  }

  try {
    const resultado = db
      .prepare('INSERT INTO clientes (nombre, email, password_hash, telefono) VALUES (?, ?, ?, ?)')
      .run(nombre.trim(), email.trim().toLowerCase(), bcrypt.hashSync(password, 10), telefono?.trim() || null)

    const creado = db.prepare('SELECT * FROM clientes WHERE id = ?').get(resultado.lastInsertRowid)
    const token = generarToken(creado, 'cliente')
    res.status(201).json({ token, cliente: clientePublico(creado) })
  } catch (error) {
    if (String(error.message).includes('UNIQUE')) {
      res.status(409).json({ error: 'Ya existe una cuenta con ese correo. Intenta iniciar sesión.' })
      return
    }
    throw error
  }
})

// POST /api/clientes/login
router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ error: 'Escribe tu correo y tu contraseña.' })
    return
  }

  const cliente = db.prepare('SELECT * FROM clientes WHERE email = ?').get(email.trim().toLowerCase())
  const coincide = cliente && bcrypt.compareSync(password, cliente.password_hash)

  if (!coincide) {
    res.status(401).json({ error: 'Correo o contraseña incorrectos.' })
    return
  }

  const token = generarToken(cliente, 'cliente')
  res.json({ token, cliente: clientePublico(cliente) })
})

// POST /api/clientes/auth-social — login/registro con Google
//
// El frontend manda el "credential" (ID token) que entrega el botón de Google.
// Aquí lo verificamos contra los servidores de Google (nunca confiamos en un
// correo/nombre que venga suelto en el body) y, con el correo ya verificado:
//   - si no existe una cuenta con ese correo, la creamos (sin password_hash)
//   - si ya existe (aunque sea una cuenta local con contraseña), la vinculamos
//     guardando su proveedor_id de Google, para que también pueda entrar así
router.post('/auth-social', async (req, res) => {
  const { credential, proveedor } = req.body

  if (proveedor !== 'google') {
    res.status(400).json({ error: 'Proveedor de inicio de sesión no soportado.' })
    return
  }

  let datosGoogle
  try {
    datosGoogle = await verificarTokenGoogle(credential)
  } catch (error) {
    res.status(401).json({ error: error.message })
    return
  }

  const { email, nombre, googleId } = datosGoogle

  try {
    let cliente = db.prepare('SELECT * FROM clientes WHERE email = ?').get(email)

    if (!cliente) {
      const resultado = db
        .prepare(
          'INSERT INTO clientes (nombre, email, password_hash, proveedor_auth, proveedor_id) VALUES (?, ?, NULL, ?, ?)'
        )
        .run(nombre, email, 'google', googleId)
      cliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(resultado.lastInsertRowid)
    } else if (!cliente.proveedor_id) {
      // Ya existía (por ejemplo, una cuenta creada con correo/contraseña):
      // la vinculamos con Google sin tocar su contraseña actual.
      db.prepare("UPDATE clientes SET proveedor_auth = 'google', proveedor_id = ? WHERE id = ?").run(
        googleId,
        cliente.id
      )
      cliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(cliente.id)
    }

    const token = generarToken(cliente, 'cliente')
    res.json({ token, cliente: clientePublico(cliente) })
  } catch (error) {
    if (String(error.message).includes('UNIQUE')) {
      res.status(409).json({ error: 'Ya existe una cuenta con ese correo.' })
      return
    }
    throw error
  }
})

// GET /api/clientes/perfil
router.get('/perfil', requiereSesion('cliente'), (req, res) => {
  const cliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(req.usuario.id)
  if (!cliente) {
    res.status(404).json({ error: 'Cuenta no encontrada.' })
    return
  }
  res.json(clientePublico(cliente))
})

// PATCH /api/clientes/perfil — edita nombre, correo, teléfono y/o contraseña
router.patch('/perfil', requiereSesion('cliente'), (req, res) => {
  const { nombre, email, telefono, passwordActual, passwordNueva } = req.body
  const cliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(req.usuario.id)

  if (!cliente) {
    res.status(404).json({ error: 'Cuenta no encontrada.' })
    return
  }

  const cambios = {
    nombre: nombre?.trim() || cliente.nombre,
    email: email?.trim().toLowerCase() || cliente.email,
    telefono: telefono?.trim() ?? cliente.telefono,
    password_hash: cliente.password_hash
  }

  if (passwordNueva) {
    // Las cuentas creadas por Google no tienen password_hash: no hay "actual"
    // que pedir, están creando su primera contraseña local, no cambiándola.
    const tienePasswordPrevia = Boolean(cliente.password_hash)

    if (tienePasswordPrevia && (!passwordActual || !bcrypt.compareSync(passwordActual, cliente.password_hash))) {
      res.status(400).json({ error: 'Tu contraseña actual no es correcta.' })
      return
    }
    if (passwordNueva.length < 8) {
      res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres.' })
      return
    }
    cambios.password_hash = bcrypt.hashSync(passwordNueva, 10)
  }

  try {
    db.prepare(
      'UPDATE clientes SET nombre = ?, email = ?, telefono = ?, password_hash = ? WHERE id = ?'
    ).run(cambios.nombre, cambios.email, cambios.telefono, cambios.password_hash, cliente.id)
  } catch (error) {
    if (String(error.message).includes('UNIQUE')) {
      res.status(409).json({ error: 'Ese correo ya lo usa otra cuenta.' })
      return
    }
    throw error
  }

  const actualizado = db.prepare('SELECT * FROM clientes WHERE id = ?').get(cliente.id)
  res.json(clientePublico(actualizado))
})

// POST /api/clientes/perfil/foto — sube/reemplaza la foto de perfil
router.post(
  '/perfil/foto',
  requiereSesion('cliente'),
  subirFotoPerfil.single('foto'),
  (req, res, next) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'Adjunta una imagen para tu foto de perfil.' })
        return
      }

      const fotoUrl = `/uploads/perfiles/${req.file.filename}`
      db.prepare('UPDATE clientes SET foto_url = ? WHERE id = ?').run(fotoUrl, req.usuario.id)

      const actualizado = db.prepare('SELECT * FROM clientes WHERE id = ?').get(req.usuario.id)
      res.json(clientePublico(actualizado))
    } catch (error) {
      next(error)
    }
  }
)

// GET /api/clientes/pedidos — historial de pedidos del cliente autenticado
router.get('/pedidos', requiereSesion('cliente'), (req, res) => {
  const pedidos = db
    .prepare('SELECT * FROM pedidos WHERE cliente_id = ? ORDER BY creado_en DESC')
    .all(req.usuario.id)
  res.json(pedidos)
})

export default router
