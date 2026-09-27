import { useRef, useState } from 'react'

const TIPOS_ACEPTADOS = ['image/png', 'image/jpeg', 'image/webp']
const TAMANO_MAXIMO_MB = 5

export default function CargaComprobante({ archivo, onCambiar, error }) {
  const [arrastrando, setArrastrando] = useState(false)
  const inputRef = useRef(null)
  const previsualizacion = archivo ? URL.createObjectURL(archivo) : null

  function validarYAsignar(listaArchivos) {
    const seleccionado = listaArchivos?.[0]
    if (!seleccionado) return

    if (!TIPOS_ACEPTADOS.includes(seleccionado.type)) {
      onCambiar(null, 'Solo se aceptan imágenes PNG, JPG o WEBP.')
      return
    }
    if (seleccionado.size > TAMANO_MAXIMO_MB * 1024 * 1024) {
      onCambiar(null, `La imagen no puede pesar más de ${TAMANO_MAXIMO_MB} MB.`)
      return
    }
    onCambiar(seleccionado, null)
  }

  function manejarSoltar(evento) {
    evento.preventDefault()
    setArrastrando(false)
    validarYAsignar(evento.dataTransfer.files)
  }

  return (
    <div>
      <label className="text-sm font-semibold text-marron-oscuro">
        Comprobante de transferencia
      </label>

      {!archivo ? (
        <div
          onDragOver={(evento) => {
            evento.preventDefault()
            setArrastrando(true)
          }}
          onDragLeave={() => setArrastrando(false)}
          onDrop={manejarSoltar}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(evento) => evento.key === 'Enter' && inputRef.current?.click()}
          className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            arrastrando ? 'border-rosa-intenso bg-rosa/20' : 'border-marron/20 bg-white/50'
          }`}
        >
          <span className="text-3xl" aria-hidden="true">📎</span>
          <p className="mt-3 text-sm text-marron/75">
            Arrastra aquí la captura de tu comprobante, o
            <span className="font-semibold text-marron-oscuro"> haz clic para elegir un archivo</span>
          </p>
          <p className="mt-1 text-xs text-marron/45">PNG, JPG o WEBP · máx. {TAMANO_MAXIMO_MB} MB</p>
          <input
            ref={inputRef}
            type="file"
            accept={TIPOS_ACEPTADOS.join(',')}
            onChange={(evento) => validarYAsignar(evento.target.files)}
            className="hidden"
          />
        </div>
      ) : (
        <div className="mt-2 flex items-center gap-4 rounded-2xl border border-marron/15 bg-white/60 p-4">
          <img
            src={previsualizacion}
            alt="Previsualización del comprobante adjunto"
            className="h-16 w-16 rounded-lg object-cover"
          />
          <div className="flex-1 text-sm">
            <p className="text-marron-oscuro">{archivo.name}</p>
            <p className="text-marron/50">{(archivo.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button
            type="button"
            onClick={() => onCambiar(null, null)}
            className="text-sm text-marron/60 underline underline-offset-2 hover:text-marron-oscuro"
          >
            Quitar
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  )
}
