import multer from 'multer'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const CARPETA_UPLOADS = path.join(__dirname, '..', '..', 'uploads')

const TIPOS_ACEPTADOS = new Set(['image/png', 'image/jpeg', 'image/webp'])

function filtroImagen(req, file, cb) {
  if (!TIPOS_ACEPTADOS.has(file.mimetype)) {
    cb(new Error('Solo se aceptan imágenes PNG, JPG o WEBP.'))
    return
  }
  cb(null, true)
}

// Crea un "subidor" de multer que guarda dentro de uploads/<subcarpeta>/,
// con un nombre de archivo único para no pisar comprobantes o fotos entre sí.
function crearSubidorImagen(subcarpeta, tamanoMaximoMB) {
  const destino = path.join(CARPETA_UPLOADS, subcarpeta)
  fs.mkdirSync(destino, { recursive: true })

  const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => cb(null, destino),
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname) || '.jpg'
      cb(null, `${Date.now()}-${randomUUID()}${extension}`)
    }
  })

  return multer({
    storage: almacenamiento,
    fileFilter: filtroImagen,
    limits: { fileSize: tamanoMaximoMB * 1024 * 1024 }
  })
}

// Comprobantes de pago (HU-04), usados en POST /api/pedidos.
export const subirComprobante = crearSubidorImagen('comprobantes', 5)

// Fotos de perfil de clientes, usadas en POST /api/clientes/perfil/foto.
export const subirFotoPerfil = crearSubidorImagen('perfiles', 3)
