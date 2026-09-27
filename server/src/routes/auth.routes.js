import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { db } from '../db/conexion.js'
import { generarToken } from '../utilidades/token.js'
import { requiereSesion } from '../middleware/auth.js'

const router = Router()

function usuarioPublico(fila) {
  if (!fila) return null
  const { password_hash, ...resto } = fila
  return resto
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ error: 'Escribe tu correo y tu contraseña.' })
    return
  }

  const usuario = db.prepare('SELECT * FROM usuarios_admin WHERE email = ?').get(email.trim().toLowerCase())
  const coincide = usuario && bcrypt.compareSync(password, usuario.password_hash)

  if (!coincide) {
    res.status(401).json({ error: 'Correo o contraseña incorrectos.' })
    return
  }

  const token = generarToken(usuario, 'staff')
  res.json({ token, usuario: usuarioPublico(usuario) })
})

// GET /api/auth/perfil
router.get('/perfil', requiereSesion('staff'), (req, res) => {
  const usuario = db.prepare('SELECT * FROM usuarios_admin WHERE id = ?').get(req.usuario.id)
  if (!usuario) {
    res.status(404).json({ error: 'Usuario no encontrado.' })
    return
  }
  res.json(usuarioPublico(usuario))
})

// PATCH /api/auth/perfil — el usuario autenticado edita su propio nombre/email/contraseña
router.patch('/perfil', requiereSesion('staff'), (req, res) => {
  const { nombre, email, passwordActual, passwordNueva } = req.body
  const usuario = db.prepare('SELECT * FROM usuarios_admin WHERE id = ?').get(req.usuario.id)

  if (!usuario) {
    res.status(404).json({ error: 'Usuario no encontrado.' })
    return
  }

  const cambios = {
    nombre: nombre?.trim() || usuario.nombre,
    email: email?.trim().toLowerCase() || usuario.email,
    password_hash: usuario.password_hash
  }

  if (passwordNueva) {
    if (!passwordActual || !bcrypt.compareSync(passwordActual, usuario.password_hash)) {
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
    db.prepare('UPDATE usuarios_admin SET nombre = ?, email = ?, password_hash = ? WHERE id = ?').run(
      cambios.nombre,
      cambios.email,
      cambios.password_hash,
      usuario.id
    )
  } catch (error) {
    if (String(error.message).includes('UNIQUE')) {
      res.status(409).json({ error: 'Ese correo ya lo usa otra cuenta.' })
      return
    }
    throw error
  }

  const actualizado = db.prepare('SELECT * FROM usuarios_admin WHERE id = ?').get(usuario.id)
  res.json(usuarioPublico(actualizado))
})

export default router
