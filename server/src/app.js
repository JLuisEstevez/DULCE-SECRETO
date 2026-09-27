import express from 'express'
import cors from 'cors'
import multer from 'multer'
import productosRouter from './routes/productos.routes.js'
import pedidosRouter from './routes/pedidos.routes.js'
import adminPedidosRouter from './routes/adminPedidos.routes.js'
import authRouter from './routes/auth.routes.js'
import usuariosRouter from './routes/usuarios.routes.js'
import clientesRouter from './routes/clientes.routes.js'
import { CARPETA_UPLOADS } from './middleware/upload.js'

export const app = express()

app.use(cors())
app.use(express.json())

// Sirve las imágenes de los comprobantes cargados (usadas por el Dashboard).
app.use('/uploads', express.static(CARPETA_UPLOADS))

app.get('/api/salud', (req, res) => res.json({ ok: true }))

app.use('/api', productosRouter)
app.use('/api/pedidos', pedidosRouter)
app.use('/api/auth', authRouter)
app.use('/api/admin/pedidos', adminPedidosRouter)
app.use('/api/admin/usuarios', usuariosRouter)
app.use('/api/clientes', clientesRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Middleware de errores: siempre al final, con 4 parámetros.
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError || error?.message?.includes('imágenes')) {
    res.status(400).json({ error: error.message })
    return
  }

  console.error(error)
  res.status(500).json({ error: 'Error interno del servidor' })
})
