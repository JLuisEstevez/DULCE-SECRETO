import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useClienteAuth } from '../context/ClienteAuthContext.jsx'
import InformacionPago from '../components/InformacionPago.jsx'
import CargaComprobante from '../components/CargaComprobante.jsx'
import { formatearCOP } from '../utils/formato.js'

export default function Checkout() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { cliente } = useClienteAuth()

  // Detecta si la compra viene de la Bolsa de compras o del Personalizador
  const vieneDeBolsa = Boolean(state?.desdeBolsa)
  const productosBolsa = state?.productosBolsa || []
  
  // Si viene de la bolsa calcula el total de la bolsa; si no, toma el del personalizador
  const total = vieneDeBolsa 
    ? (state?.totalBolsa || 0) 
    : (state?.configuracion?.total || state?.producto?.precio_base || 0)

  // Resumen del producto para guardar en base de datos
  const productoResumen = vieneDeBolsa
    ? productosBolsa.map((i) => `${i.cantidad}x ${i.nombre}`).join(', ')
    : (state?.configuracion?.resumen || state?.producto?.nombre || 'Pedido personalizado')

  const [nombre, setNombre] = useState(cliente?.nombre || '')
  const [telefono, setTelefono] = useState(cliente?.telefono || '')
  const [direccion, setDireccion] = useState(cliente?.direccion || '')
  const [fechaEntrega, setFechaEntrega] = useState('')
  const [notas, setNotas] = useState('')
  const [comprobante, setComprobante] = useState(null)
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  // Si alguien entra directo a /checkout sin haber agregado nada
  if (!state && (!productosBolsa || productosBolsa.length === 0)) {
    return (
      <section className="contenedor flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <h1 className="font-serif text-2xl text-marron">No tienes productos seleccionados</h1>
        <p className="mt-2 text-sm text-marron/60">
          Agrega productos a tu bolsa o personaliza una torta para proceder al pago.
        </p>
        <Link to="/catalogo" className="btn-primario mt-6">
          Ir al Catálogo
        </Link>
      </section>
    )
  }

  async function manejarEnvio(e) {
    e.preventDefault()
    setError(null)

    if (!comprobante) {
      setError('Por favor adjunta el comprobante de pago.')
      return
    }

    setEnviando(true)

    try {
      const formData = new FormData()
      formData.append('cliente_nombre', nombre)
      formData.append('telefono', telefono)
      formData.append('direccion', direccion)
      formData.append('fecha_entrega', fechaEntrega)
      formData.append('notas', notas)
      formData.append('producto_resumen', productoResumen)
      formData.append('total', total)
      formData.append('comprobante', comprobante)

      if (cliente?.id) {
        formData.append('cliente_id', cliente.id)
      }

      const respuesta = await fetch('/api/pedidos', {
        method: 'POST',
        body: formData
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo registrar el pedido')
      }

      // Si la compra fue exitosa y venía de la bolsa, vaciamos la bolsa
      if (vieneDeBolsa) {
        localStorage.removeItem('ds_carrito')
        window.dispatchEvent(new Event('ds_carrito_actualizado'))
      }

      // Alerta de confirmación con el código asignado
      alert(`¡Pedido realizado con éxito! Código: ${datos.codigo_seguimiento}`)
      navigate(cliente ? '/cuenta/pedidos' : '/')
    } catch (err) {
      setError(err.message || 'Error al procesar el pedido')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="contenedor py-12">
      <h1 className="font-serif text-3xl font-bold text-marron">Finalizar Pedido</h1>
      <p className="mt-1 text-sm text-marron/60">
        Completa los datos de entrega y realiza la transferencia para confirmar tu pedido.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Formulario de Entrega */}
        <form onSubmit={manejarEnvio} className="flex flex-col gap-4">
          <h2 className="font-serif text-xl font-bold text-marron">Datos de Entrega</h2>

          <label className="block text-xs font-semibold uppercase tracking-wider text-marron/70">
            Nombre Completo
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre y apellido"
              className="mt-1.5 w-full rounded-xl border border-marron/20 bg-white px-4 py-2.5 text-sm text-marron focus:border-rosa-intenso focus:outline-none"
            />
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wider text-marron/70">
            Teléfono / WhatsApp
            <input
              type="tel"
              required
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="300 123 4567"
              className="mt-1.5 w-full rounded-xl border border-marron/20 bg-white px-4 py-2.5 text-sm text-marron focus:border-rosa-intenso focus:outline-none"
            />
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wider text-marron/70">
            Dirección de Entrega
            <input
              type="text"
              required
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Calle, número, barrio o retiro en local"
              className="mt-1.5 w-full rounded-xl border border-marron/20 bg-white px-4 py-2.5 text-sm text-marron focus:border-rosa-intenso focus:outline-none"
            />
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wider text-marron/70">
            Fecha de Entrega deseada
            <input
              type="date"
              required
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-marron/20 bg-white px-4 py-2.5 text-sm text-marron focus:border-rosa-intenso focus:outline-none"
            />
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wider text-marron/70">
            Notas o mensaje para la tarjeta (opcional)
            <textarea
              rows={2}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Dedicatoria especial, indicaciones de entrega..."
              className="mt-1.5 w-full rounded-xl border border-marron/20 bg-white px-4 py-2.5 text-sm text-marron focus:border-rosa-intenso focus:outline-none"
            />
          </label>

          {/* Subida de Comprobante */}
          <div className="mt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-marron/70">
              Adjuntar Comprobante
            </h3>
            <div className="mt-2">
              <CargaComprobante onArchivoSeleccionado={(archivo) => setComprobante(archivo)} />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="btn-primario mt-4 w-full py-3 text-center disabled:opacity-50"
          >
            {enviando ? 'Enviando Pedido...' : `Confirmar Pedido · ${formatearCOP(total)}`}
          </button>
        </form>

        {/* Resumen e Información Bancaria */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-marron/10 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-marron">Resumen de la Orden</h2>
            <p className="mt-2 text-sm text-marron/70 font-medium">{productoResumen}</p>
            <div className="mt-4 flex justify-between border-t border-marron/10 pt-4 text-base font-bold text-marron">
              <span>Total a Transferir:</span>
              <span className="text-rosa-intenso">{formatearCOP(total)}</span>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-serif text-lg font-bold text-marron">Cuentas Autorizadas</h3>
            {/* Aquí se renderiza tu componente oficial de pagos */}
            <InformacionPago />
          </div>
        </div>
      </div>
    </section>
  )
}