import { verificarToken } from '../utilidades/token.js'

// Fábrica de middlewares de sesión. "tipoEsperado" distingue entre los dos
// sistemas de cuentas que existen en este proyecto y que NO se mezclan:
//   - 'staff'   → usuarios_admin (equipo de Kelly: admin/editor)
//   - 'cliente' → clientes (quien compra, ve su historial de pedidos)
// Un token de cliente nunca sirve para entrar al panel, y viceversa.
export function requiereSesion(tipoEsperado) {
  return (req, res, next) => {
    const encabezado = req.headers.authorization || ''
    const [esquema, token] = encabezado.split(' ')

    if (esquema !== 'Bearer' || !token) {
      res.status(401).json({ error: 'Debes iniciar sesión para acceder a este recurso.' })
      return
    }

    let payload
    try {
      payload = verificarToken(token)
    } catch {
      res.status(401).json({ error: 'Tu sesión no es válida o expiró. Inicia sesión de nuevo.' })
      return
    }

    if (tipoEsperado && payload.tipo !== tipoEsperado) {
      res.status(403).json({ error: 'Este token no tiene permiso para acceder a este recurso.' })
      return
    }

    req.usuario = payload
    next()
  }
}

// Igual que requiereSesion('cliente'), pero si no hay token (o no es válido)
// simplemente sigue sin autenticar, en vez de responder con error. Se usa en
// POST /api/pedidos para poder asociar el pedido a una cuenta SI el cliente iba
// con sesión iniciada, sin romper el flujo de compra como invitado.
export function sesionClienteOpcional(req, res, next) {
  const encabezado = req.headers.authorization || ''
  const [esquema, token] = encabezado.split(' ')

  if (esquema === 'Bearer' && token) {
    try {
      const payload = verificarToken(token)
      if (payload.tipo === 'cliente') req.usuario = payload
    } catch {
      // Token inválido o vencido: seguimos como invitado, sin bloquear la compra.
    }
  }

  next()
}
