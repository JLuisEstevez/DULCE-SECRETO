import { Router } from 'express'
import { db } from '../db/conexion.js'
import { requiereSesion } from '../middleware/auth.js'

const router = Router()
router.use(requiereSesion('staff'))

const ESTADOS_PEDIDO_VALIDOS = ['Por Validar', 'En Preparación', 'Horneando', 'Entregado']
const ESTADOS_PAGO_VALIDOS = ['Pendiente', 'Aprobado', 'Rechazado']

// GET /api/admin/pedidos
router.get('/', (req, res) => {
  const pedidos = db.prepare('SELECT * FROM pedidos ORDER BY fecha_entrega ASC, creado_en ASC').all()
  res.json(pedidos)
})

// PATCH /api/admin/pedidos/:id/estado
router.patch('/:id/estado', (req, res) => {
  const { id } = req.params
  const { estado_pedido, estado_pago } = req.body

  const pedidoExistente = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(id)
  if (!pedidoExistente) {
    res.status(404).json({ error: 'El pedido no existe.' })
    return
  }

  if (estado_pedido && !ESTADOS_PEDIDO_VALIDOS.includes(estado_pedido)) {
    res.status(400).json({ error: 'estado_pedido no es válido.' })
    return
  }
  if (estado_pago && !ESTADOS_PAGO_VALIDOS.includes(estado_pago)) {
    res.status(400).json({ error: 'estado_pago no es válido.' })
    return
  }

  db.prepare(
    `UPDATE pedidos
     SET estado_pedido = COALESCE(?, estado_pedido),
         estado_pago = COALESCE(?, estado_pago)
     WHERE id = ?`
  ).run(estado_pedido ?? null, estado_pago ?? null, id)

  const pedidoActualizado = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(id)
  res.json(pedidoActualizado)
})

export default router
