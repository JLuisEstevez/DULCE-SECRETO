import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { obtenerPedidosAdmin, actualizarEstadoPedido } from '../services/api.js'
import CalendarioPedidos from '../components/CalendarioPedidos.jsx'
import TableroKanban from '../components/TableroKanban.jsx'
import ModalRevisionPedido from '../components/ModalRevisionPedido.jsx'

export default function Admin() {
  const { usuario, cerrarSesion } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [vista, setVista] = useState('kanban')
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)

  useEffect(() => {
    let activo = true

    obtenerPedidosAdmin()
      .then((datos) => {
        if (activo) setPedidos(datos)
      })
      .catch((error) => {
        if (!activo) return
        if (error.message.includes('sesión')) {
          cerrarSesion()
          return
        }
        setError(error.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [])

  async function actualizarPedido(id, cambios) {
    // Actualización optimista para que la UI responda al instante...
    setPedidos((actuales) => actuales.map((p) => (p.id === id ? { ...p, ...cambios } : p)))
    setPedidoSeleccionado((actual) => (actual?.id === id ? { ...actual, ...cambios } : actual))

    try {
      // ...y luego confirmamos contra el backend (PATCH /api/admin/pedidos/:id/estado).
      const pedidoActualizado = await actualizarEstadoPedido(id, cambios)
      setPedidos((actuales) => actuales.map((p) => (p.id === id ? pedidoActualizado : p)))
      setPedidoSeleccionado((actual) => (actual?.id === id ? pedidoActualizado : actual))
    } catch (error) {
      setError(`No se pudo actualizar el pedido: ${error.message}`)
    }
  }

  const pendientesPorValidar = pedidos.filter((p) => p.estado_pago === 'Pendiente').length

  return (
    <section className="contenedor py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-marron/10 pb-4 text-sm">
        <div className="flex items-center gap-4 text-marron/60">
          <span>
            Conectada como <strong className="text-marron-oscuro">{usuario.nombre}</strong> ({usuario.rol})
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/admin/perfil" className="hover:text-marron-oscuro">Mi perfil</Link>
          {usuario.rol === 'admin' && (
            <Link to="/admin/usuarios" className="hover:text-marron-oscuro">Usuarios</Link>
          )}
          <button type="button" onClick={cerrarSesion} className="text-red-700 hover:text-red-800">
            Cerrar sesión
          </button>
        </div>
      </div>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-marron/50">Panel privado</p>
          <h1 className="text-3xl">Hola, {usuario.nombre.split(' ')[0]} 👋</h1>
          <p className="mt-1 text-marron/70">
            {pendientesPorValidar > 0
              ? `Tienes ${pendientesPorValidar} pago(s) por validar.`
              : 'No tienes pagos pendientes por validar.'}
          </p>
        </div>

        <div className="flex overflow-hidden rounded-full border border-marron/15 text-sm">
          <button
            type="button"
            onClick={() => setVista('kanban')}
            className={`px-4 py-2 ${vista === 'kanban' ? 'bg-marron text-crema-suave' : 'text-marron/70'}`}
          >
            Tablero de cocina
          </button>
          <button
            type="button"
            onClick={() => setVista('calendario')}
            className={`px-4 py-2 ${vista === 'calendario' ? 'bg-marron text-crema-suave' : 'text-marron/70'}`}
          >
            Calendario
          </button>
        </div>
      </header>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {cargando ? (
        <p className="mt-10 text-center text-marron/50">Cargando pedidos...</p>
      ) : (
        <div className="mt-8">
          {vista === 'kanban' ? (
            <TableroKanban
              pedidos={pedidos}
              onSeleccionarPedido={setPedidoSeleccionado}
              onActualizarPedido={actualizarPedido}
            />
          ) : (
            <CalendarioPedidos pedidos={pedidos} onSeleccionarPedido={setPedidoSeleccionado} />
          )}
        </div>
      )}

      <p className="mt-10 text-xs text-marron/40">
        Datos en vivo desde GET /api/admin/pedidos, protegidos con inicio de sesión.
      </p>

      <ModalRevisionPedido
        pedido={pedidoSeleccionado}
        onCerrar={() => setPedidoSeleccionado(null)}
        onActualizar={actualizarPedido}
      />
    </section>
  )
}
