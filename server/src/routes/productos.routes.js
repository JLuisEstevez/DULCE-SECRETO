import { Router } from 'express'
import { db } from '../db/conexion.js'

const router = Router()

// GET /api/productos
router.get('/productos', (req, res) => {
  const filas = db.prepare('SELECT * FROM productos ORDER BY categoria, nombre').all()
  const productos = filas.map((fila) => ({
    ...fila,
    personalizable: Boolean(fila.personalizable)
  }))
  res.json(productos)
})

// GET /api/opciones-personalizacion
// Agrupa la tabla OpcionesPersonalizacion por tipo, en el formato
// que ya espera el Personalizador del frontend.
router.get('/opciones-personalizacion', (req, res) => {
  const filas = db.prepare('SELECT * FROM opciones_personalizacion ORDER BY tipo, nombre').all()

  const agrupado = {
    porciones: filas.filter((f) => f.tipo === 'porcion'),
    sabores: filas.filter((f) => f.tipo === 'sabor'),
    rellenos: filas.filter((f) => f.tipo === 'relleno'),
    toppings: filas.filter((f) => f.tipo === 'topping')
  }

  res.json(agrupado)
})

export default router
