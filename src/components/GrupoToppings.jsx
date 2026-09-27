import { formatearCOP } from '../utils/formato.js'

export default function GrupoToppings({ opciones, seleccionados, onCambiar }) {
  function alternar(id) {
    if (seleccionados.includes(id)) {
      onCambiar(seleccionados.filter((seleccionadoId) => seleccionadoId !== id))
    } else {
      onCambiar([...seleccionados, id])
    }
  }

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-marron-oscuro">
        Toppings decorativos <span className="font-normal text-marron/50">(opcional)</span>
      </legend>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {opciones.map((opcion) => {
          const activo = seleccionados.includes(opcion.id)
          return (
            <label
              key={opcion.id}
              className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm transition-colors ${
                activo
                  ? 'border-rosa-intenso bg-rosa/50 text-marron-oscuro'
                  : 'border-marron/15 text-marron/80 hover:border-marron/35'
              }`}
            >
              <input
                type="checkbox"
                checked={activo}
                onChange={() => alternar(opcion.id)}
                className="sr-only"
              />
              <span className="block">{opcion.nombre}</span>
              <span className="block text-xs text-marron/50">
                +{formatearCOP(opcion.costo_adicional)}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
