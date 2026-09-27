import { formatearCOP } from '../utils/formato.js'

const ESTILOS_PAGO = {
  Pendiente: 'bg-amber-100 text-amber-800',
  Aprobado: 'bg-green-100 text-green-800',
  Rechazado: 'bg-red-100 text-red-700'
}

export default function TarjetaPedido({ pedido, onSeleccionar, arrastrable = false }) {
  return (
    <button
      type="button"
      onClick={() => onSeleccionar(pedido)}
      draggable={arrastrable}
      onDragStart={(evento) => evento.dataTransfer.setData('text/plain', pedido.id)}
      className="w-full rounded-xl border border-marron/12 bg-white p-3 text-left text-sm shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-marron-oscuro">{pedido.cliente_nombre}</span>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${ESTILOS_PAGO[pedido.estado_pago]}`}>
          {pedido.estado_pago}
        </span>
      </div>
      <p className="mt-1 text-marron/60">{pedido.producto_resumen}</p>
      <div className="mt-2 flex items-center justify-between text-xs text-marron/50">
        <span>{pedido.id}</span>
        <span>{formatearCOP(pedido.total)}</span>
      </div>
    </button>
  )
}
