import { formatearCOP } from '../utils/formato.js'

export default function ModalRevisionPedido({ pedido, onCerrar, onActualizar }) {
  if (!pedido) return null

  function aprobar() {
    onActualizar(pedido.id, {
      estado_pago: 'Aprobado',
      estado_pedido: pedido.estado_pedido === 'Por Validar' ? 'En Preparación' : pedido.estado_pedido
    })
    onCerrar()
  }

  function rechazar() {
    onActualizar(pedido.id, { estado_pago: 'Rechazado' })
    onCerrar()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-marron-oscuro/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-modal-pedido"
      onClick={onCerrar}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-crema-suave p-6 shadow-xl"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-marron/50">{pedido.id}</p>
            <h2 id="titulo-modal-pedido" className="text-xl text-marron-oscuro">
              {pedido.cliente_nombre}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-full p-1 text-marron/50 hover:bg-marron/10 hover:text-marron-oscuro"
          >
            ✕
          </button>
        </div>

        <dl className="mt-5 space-y-2 text-sm text-marron/75">
          <div className="flex justify-between gap-4">
            <dt>Producto</dt>
            <dd className="text-right">{pedido.producto_resumen}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Teléfono</dt>
            <dd className="text-right">{pedido.telefono}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Entrega</dt>
            <dd className="text-right">{pedido.direccion}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Fecha de entrega</dt>
            <dd className="text-right">{pedido.fecha_entrega}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-marron/10 pt-2">
            <dt className="font-semibold text-marron-oscuro">Total</dt>
            <dd className="text-right font-semibold text-marron-oscuro">{formatearCOP(pedido.total)}</dd>
          </div>
        </dl>

        <div className="mt-5">
          <p className="text-sm font-semibold text-marron-oscuro">Comprobante de pago</p>
          {pedido.comprobante_url ? (
            <a
              href={pedido.comprobante_url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block overflow-hidden rounded-xl border border-marron/15 bg-white/70"
            >
              <img
                src={pedido.comprobante_url}
                alt={`Comprobante de pago de ${pedido.cliente_nombre}`}
                className="max-h-64 w-full object-contain"
              />
            </a>
          ) : (
            <div className="mt-2 flex items-center gap-3 rounded-xl border border-marron/15 bg-white/70 p-4">
              <span className="text-3xl" aria-hidden="true">🧾</span>
              <p className="text-sm text-marron/60">Este pedido no tiene comprobante adjunto.</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={aprobar}
            disabled={pedido.estado_pago === 'Aprobado'}
            className="btn-primario flex-1 disabled:opacity-50"
          >
            Aprobar pago
          </button>
          <button
            type="button"
            onClick={rechazar}
            disabled={pedido.estado_pago === 'Rechazado'}
            className="flex-1 rounded-full border border-red-300 px-6 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            Rechazar pago
          </button>
        </div>
      </div>
    </div>
  )
}
