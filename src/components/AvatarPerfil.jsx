import { useRef, useState } from 'react'

export default function AvatarPerfil({ fotoUrl, nombre, onSubir, subiendo }) {
  const inputRef = useRef(null)
  const [error, setError] = useState(null)

  function manejarSeleccion(evento) {
    const archivo = evento.target.files?.[0]
    if (!archivo) return

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(archivo.type)) {
      setError('Solo se aceptan imágenes PNG, JPG o WEBP.')
      return
    }
    if (archivo.size > 3 * 1024 * 1024) {
      setError('La imagen no puede pesar más de 3 MB.')
      return
    }

    setError(null)
    onSubir(archivo)
  }

  const iniciales = nombre
    .split(' ')
    .slice(0, 2)
    .map((palabra) => palabra[0]?.toUpperCase())
    .join('')

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={subiendo}
        className="group relative h-24 w-24 overflow-hidden rounded-full border-2 border-rosa-intenso bg-rosa/40 disabled:opacity-60"
        aria-label="Cambiar foto de perfil"
      >
        {fotoUrl ? (
          <img src={fotoUrl} alt={`Foto de perfil de ${nombre}`} className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-display text-2xl italic text-marron-oscuro">
            {iniciales || '🙂'}
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-marron-oscuro/0 text-xs font-medium text-transparent transition-colors group-hover:bg-marron-oscuro/50 group-hover:text-crema-suave">
          {subiendo ? 'Subiendo...' : 'Cambiar'}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={manejarSeleccion}
        className="hidden"
      />

      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  )
}
