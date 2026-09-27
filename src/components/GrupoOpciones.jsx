import { formatearCOP } from '../utils/formato.js'

export default function GrupoOpciones({ etiqueta, nombre, opciones, valorSeleccionado, onCambiar }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-marron-oscuro">{etiqueta}</legend>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {opciones.map((opcion) => {
          const activo = valorSeleccionado === opcion.id
          return (
            <label
              key={opcion.id}
              className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm transition-colors ${
                activo
                  ? 'border-marron bg-marron text-crema-suave'
                  : 'border-marron/15 text-marron/80 hover:border-marron/35'
              }`}
            >
              <input
                type="radio"
                name={nombre}
                value={opcion.id}
                checked={activo}
                onChange={() => onCambiar(opcion.id)}
                className="sr-only"
              />
              <span className="block">{opcion.nombre ?? `${opcion.porciones} porciones`}</span>
              {'costo_adicional' in opcion && opcion.costo_adicional > 0 && (
                <span className={`block text-xs ${activo ? 'text-crema-suave/80' : 'text-marron/50'}`}>
                  +{formatearCOP(opcion.costo_adicional)}
                </span>
              )}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
