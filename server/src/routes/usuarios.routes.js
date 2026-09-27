import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { db } from '../db/conexion.js'
import { requiereSesion } from '../middleware/auth.js'

const router = Router()
router.use(requiereSesion('staff'))

function soloAdmin(req, res, next) {
  if (req.usuario.rol !== 'admin') {
    res.status(403).json({ error: 'Solo una cuenta administradora puede gestionar usuarios.' })
    return
  }
  next()
}
router.use(soloAdmin)

function usuarioPublico(fila) {
  const { password_hash, ...resto } = fila
  return resto
}

// GET /api/admin/usuarios
router.get('/', (req, res) => {
  const usuarios = db.prepare('SELECT * FROM usuarios_admin ORDER BY creado_en ASC').all()
  res.json(usuarios.map(usuarioPublico))
})

// POST /api/admin/usuarios — crear una nueva cuenta administrativa
router.post('/', (req, res) => {
  const { nombre, email, password, rol } = req.body

  if (!nombre?.trim() || !email?.trim() || !password) {
    res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios.' })
    return
  }
  if (password.length < 8) {
    res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' })
    return
  }
  if (rol && !['admin', 'editor'].includes(rol)) {
    res.status(400).json({ error: 'El rol debe ser "admin" o "editor".' })
    return
  }

  try {
    const resultado = db
      .prepare('INSERT INTO usuarios_admin (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)')
      .run(nombre.trim(), email.trim().toLowerCase(), bcrypt.hashSync(password, 10), rol || 'editor')

    const creado = db.prepare('SELECT * FROM usuarios_admin WHERE id = ?').get(resultado.lastInsertRowid)
    res.status(201).json(usuarioPublico(creado))
  } catch (error) {
    if (String(error.message).includes('UNIQUE')) {
      res.status(409).json({ error: 'Ya existe una cuenta con ese correo.' })
      return
    }
    throw error
  }
})

// DELETE /api/admin/usuarios/:id — no permite que te elimines a ti mismo
router.delete('/:id', (req, res) => {
  const idObjetivo = Number(req.params.id)

  if (idObjetivo === req.usuario.id) {
    res.status(400).json({ error: 'No puedes eliminar tu propia cuenta mientras tienes la sesión abierta.' })
    return
  }

  const existente = db.prepare('SELECT id FROM usuarios_admin WHERE id = ?').get(idObjetivo)
  if (!existente) {
    res.status(404).json({ error: 'Ese usuario no existe.' })
    return
  }

  db.prepare('DELETE FROM usuarios_admin WHERE id = ?').run(idObjetivo)
  res.status(204).send()
})

export default router
