import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useClienteAuth } from '../context/ClienteAuthContext.jsx'
import { obtenerPedidosCliente } from '../services/api.js'
import { formatearCOP } from '../utils/formato.js'

const ESTILOS_ESTADO = {
  'Por Validar': 'bg-amber-100 text-amber-800',
  'En Preparación': 'bg-blue-100 text-blue-800',
  Horneando: 'bg-orange-100 text-orange-800',
  Entregado: 'bg-green-100 text-green-800'
}

export default function MisPedidos() {
  const { cliente } = useClienteAuth()
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    obtenerPedidosCliente()
      .then(setPedidos)
      .catch((error) => setError(error.message))
      .finally(() => setCargando(false))
  }, [])

  return (
    <section className="contenedor py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-marron/50">Mi cuenta</p>
          <h1 className="text-3xl">Hola, {cliente.nombre.split(' ')[0]} 👋</h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/cuenta/perfil" className="text-marron/70 hover:text-marron-oscuro">Mi perfil</Link>
          <Link to="/catalogo" className="btn-secundario !px-4 !py-2">Hacer un nuevo pedido</Link>
        </div>
      </div>

      {error && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {cargando ? (
        <p className="mt-10 text-center text-marron/50">Cargando tus pedidos...</p>
      ) : pedidos.length === 0 ? (
        <div className="mt-16 text-center text-marron/60">
          <p>Todavía no tienes pedidos.</p>
          <Link to="/catalogo" className="mt-3 inline-block underline">Explora el catálogo</Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {pedidos.map((pedido) => (
            <li key={pedido.id} className="rounded-2xl border border-marron/10 bg-white/60 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-body text-base text-marron-oscuro">{pedido.producto_resumen}</p>
                  <p className="mt-1 text-xs text-marron/50">
                    Código {pedido.codigo_seguimiento} · Pedido el{' '}
                    {new Date(pedido.creado_en).toLocaleDateString('es-CO')}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${ESTILOS_ESTADO[pedido.estado_pedido]}`}
                >
                  {pedido.estado_pedido}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-marron/10 pt-4 text-sm text-marron/70">
                <span>Entrega: {pedido.fecha_entrega}</span>
                <span>Pago: {pedido.estado_pago}</span>
                <span className="font-semibold text-marron-oscuro">{formatearCOP(pedido.total)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
