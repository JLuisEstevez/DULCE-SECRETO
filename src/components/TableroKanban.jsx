import { useState } from 'react'
import { ESTADOS_PEDIDO } from '../utils/estados.js'
import TarjetaPedido from './TarjetaPedido.jsx'

export default function TableroKanban({ pedidos, onSeleccionarPedido, onActualizarPedido }) {
  const [columnaActiva, setColumnaActiva] = useState(null)

  function manejarSoltar(evento, estado) {
    evento.preventDefault()
    const idPedido = evento.dataTransfer.getData('text/plain')
    if (idPedido) onActualizarPedido(idPedido, { estado_pedido: estado })
    setColumnaActiva(null)
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {ESTADOS_PEDIDO.map((estado) => {
        const pedidosColumna = pedidos.filter((pedido) => pedido.estado_pedido === estado)

        return (
          <div
            key={estado}
            onDragOver={(evento) => {
              evento.preventDefault()
              setColumnaActiva(estado)
            }}
            onDragLeave={() => setColumnaActiva((actual) => (actual === estado ? null : actual))}
            onDrop={(evento) => manejarSoltar(evento, estado)}
            className={`flex min-h-[16rem] flex-col gap-3 rounded-2xl border p-3 transition-colors ${
              columnaActiva === estado ? 'border-rosa-intenso bg-rosa/15' : 'border-marron/10 bg-white/40'
            }`}
          >
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-marron-oscuro">{estado}</h3>
              <span className="rounded-full bg-marron/10 px-2 py-0.5 text-xs text-marron/60">
                {pedidosColumna.length}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-2">
              {pedidosColumna.length === 0 && (
                <p className="mt-4 text-center text-xs text-marron/40">Sin pedidos aquí</p>
              )}
              {pedidosColumna.map((pedido) => (
                <TarjetaPedido
                  key={pedido.id}
                  pedido={pedido}
                  onSeleccionar={onSeleccionarPedido}
                  arrastrable
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
