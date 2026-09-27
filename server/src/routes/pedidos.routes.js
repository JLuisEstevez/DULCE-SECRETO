import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { db } from '../db/conexion.js'
import { subirComprobante } from '../middleware/upload.js'
import { sesionClienteOpcional } from '../middleware/auth.js'
import { generarCodigoSeguimiento } from '../utilidades/codigoSeguimiento.js'

const router = Router()

const obtenerProducto = db.prepare('SELECT * FROM productos WHERE id = ?')
const obtenerOpcion = db.prepare('SELECT * FROM opciones_personalizacion WHERE id = ?')
const insertarPedido = db.prepare(`
  INSERT INTO pedidos (
    id, cliente_id, codigo_seguimiento, cliente_nombre, telefono, direccion, fecha_entrega,
    notas, producto_resumen, total, comprobante_url
  ) VALUES (
    @id, @cliente_id, @codigo_seguimiento, @cliente_nombre, @telefono, @direccion, @fecha_entrega,
    @notas, @producto_resumen, @total, @comprobante_url
  )
`)
const insertarDetalle = db.prepare(`
  INSERT INTO detalle_pedido (pedido_id, producto_id, configuracion_json, subtotal)
  VALUES (@pedido_id, @producto_id, @configuracion_json, @subtotal)
`)

function calcularConfiguracionPersonalizable(body) {
  const porciones = obtenerOpcion.get(body.porciones_id)
  const sabor = obtenerOpcion.get(body.sabor_id)
  const relleno = obtenerOpcion.get(body.relleno_id)

  if (!porciones || porciones.tipo !== 'porcion') throw new ErrorValidacion('Selecciona una cantidad de porciones válida.')
  if (!sabor || sabor.tipo !== 'sabor') throw new ErrorValidacion('Selecciona un sabor válido.')
  if (!relleno || relleno.tipo !== 'relleno') throw new ErrorValidacion('Selecciona un relleno válido.')

  let toppingsIds = []
  if (body.toppings_ids) {
    try {
      toppingsIds = JSON.parse(body.toppings_ids)
    } catch {
      throw new ErrorValidacion('Los toppings enviados no son válidos.')
    }
  }
  const toppings = toppingsIds
    .map((id) => obtenerOpcion.get(id))
    .filter((opcion) => opcion && opcion.tipo === 'topping')

  return { porciones, sabor, relleno, toppings }
}

class ErrorValidacion extends Error {}

// POST /api/pedidos
router.post('/', sesionClienteOpcional, subirComprobante.single('comprobante'), (req, res, next) => {
  try {
    const { body, file } = req

    const camposRequeridos = ['cliente_nombre', 'telefono', 'direccion', 'fecha_entrega', 'producto_id']
    for (const campo of camposRequeridos) {
      if (!body[campo] || !String(body[campo]).trim()) {
        throw new ErrorValidacion(`Falta el campo requerido: ${campo}.`)
      }
    }
    if (!file) {
      throw new ErrorValidacion('Debes adjuntar el comprobante de pago.')
    }

    const producto = obtenerProducto.get(body.producto_id)
    if (!producto) throw new ErrorValidacion('El producto seleccionado no existe.')

    let total
    let productoResumen
    let configuracion

    if (producto.personalizable) {
      const { porciones, sabor, relleno, toppings } = calcularConfiguracionPersonalizable(body)
      const base = producto.precio_base * porciones.factor
      const costoToppings = toppings.reduce((suma, t) => suma + t.costo_adicional, 0)
      total = Math.round(base + sabor.costo_adicional + relleno.costo_adicional + costoToppings)

      productoResumen = `${producto.nombre} · ${porciones.nombre}`
      configuracion = {
        porciones: porciones.nombre,
        sabor: sabor.nombre,
        relleno: relleno.nombre,
        toppings: toppings.map((t) => t.nombre)
      }
    } else {
      const cantidad = Math.max(1, parseInt(body.cantidad, 10) || 1)
      total = producto.precio_base * cantidad
      productoResumen = `${producto.nombre} · ${cantidad} unidad(es)`
      configuracion = { cantidad }
    }

    const idPedido = randomUUID()
    const comprobanteUrl = `/uploads/comprobantes/${file.filename}`

    insertarPedido.run({
      id: idPedido,
      cliente_id: req.usuario?.id ?? null,
      codigo_seguimiento: generarCodigoSeguimiento(),
      cliente_nombre: body.cliente_nombre,
      telefono: body.telefono,
      direccion: body.direccion,
      fecha_entrega: body.fecha_entrega,
      notas: body.notas || null,
      producto_resumen: productoResumen,
      total,
      comprobante_url: comprobanteUrl
    })

    insertarDetalle.run({
      pedido_id: idPedido,
      producto_id: producto.id,
      configuracion_json: JSON.stringify(configuracion),
      subtotal: total
    })

    const pedidoCreado = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(idPedido)
    res.status(201).json(pedidoCreado)
  } catch (error) {
    if (error instanceof ErrorValidacion) {
      res.status(400).json({ error: error.message })
      return
    }
    next(error)
  }
})

export default router
