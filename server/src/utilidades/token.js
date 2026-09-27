import jwt from 'jsonwebtoken'

// En un .env real deberías poner un secreto largo y propio (ver .env.example).
// Este valor por defecto solo existe para que el proyecto funcione sin configuración
// adicional en desarrollo; cámbialo antes de usarlo en producción.
const SECRETO = process.env.JWT_SECRET || 'secreto-dev-inseguro-cambia-esto'
const DURACION_TOKEN = '8h'

// tipo: 'staff' (usuarios_admin) o 'cliente' (clientes). Queda dentro del token
// para que un token de un sistema nunca pueda usarse como si fuera del otro.
export function generarToken(usuario, tipo) {
  const payload = { id: usuario.id, email: usuario.email, nombre: usuario.nombre, tipo }
  if (usuario.rol) payload.rol = usuario.rol
  return jwt.sign(payload, SECRETO, { expiresIn: DURACION_TOKEN })
}

export function verificarToken(token) {
  return jwt.verify(token, SECRETO)
}
