import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import InformacionPago from '../components/InformacionPago.jsx'
import CargaComprobante from '../components/CargaComprobante.jsx'
import { crearPedido } from '../services/api.js'
import { formatearCOP } from '../utils/formato.js'
import { useClienteAuth } from '../context/ClienteAuthContext.jsx'

function fechaMinimaEntrega() {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + 2) // 48 horas de anticipación
  return fecha.toISOString().split('T')[0]
}

function camposIniciales(cliente) {
  return {
    nombre: cliente?.nombre ?? '',
    telefono: cliente?.telefono ?? '',
    direccion: '',
    fechaEntrega: '',
    notas: ''
  }
}

export default function Checkout() {
  const { state } = useLocation()
  const { cliente } = useClienteAuth()
  const producto = state?.producto ?? null
  const seleccion = state?.seleccion ?? null
  const resumenProducto = state?.resumen ?? null

  const [campos, setCampos] = useState(() => camposIniciales(cliente))
  const [comprobante, setComprobante] = useState(null)
  const [errorComprobante, setErrorComprobante] = useState(null)
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState(null)
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null)

  function actualizarCampo(nombreCampo, valor) {
    setCampos((anterior) => ({ ...anterior, [nombreCampo]: valor }))
  }

  function validar() {
    const nuevosErrores = {}
    if (!campos.nombre.trim()) nuevosErrores.nombre = 'Escribe tu nombre completo.'
    if (!/^\d{7,10}$/.test(campos.telefono.replace(/\s/g, ''))) {
      nuevosErrores.telefono = 'Escribe un número de WhatsApp válido.'
    }
    if (!campos.direccion.trim()) nuevosErrores.direccion = 'Indica la dirección o punto de retiro.'
    if (!campos.fechaEntrega) nuevosErrores.fechaEntrega = 'Elige la fecha de entrega.'
    if (!comprobante) nuevosErrores.comprobante = 'Adjunta la captura del comprobante de pago.'

    setErrores(nuevosErrores)
    if (!comprobante) setErrorComprobante('Adjunta la captura del comprobante de pago.')

    return Object.keys(nuevosErrores).length === 0
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorEnvio(null)
    if (!validar() || !producto || !seleccion) return

    const formData = new FormData()
    formData.append('cliente_nombre', campos.nombre)
    formData.append('telefono', campos.telefono)
    formData.append('direccion', campos.direccion)
    formData.append('fecha_entrega', campos.fechaEntrega)
    formData.append('notas', campos.notas)
    formData.append('producto_id', producto.id)
    formData.append('comprobante', comprobante)

    if (producto.personalizable) {
      formData.append('porciones_id', seleccion.porcionesId)
      formData.append('sabor_id', seleccion.saborId)
      formData.append('relleno_id', seleccion.rellenoId)
      formData.append('toppings_ids', JSON.stringify(seleccion.toppingsIds ?? []))
    } else {
      formData.append('cantidad', seleccion.cantidad)
    }

    setEnviando(true)
    try {
      const pedido = await crearPedido(formData)
      setPedidoConfirmado(pedido)
    } catch (error) {
      setErrorEnvio(error.message)
    } finally {
      setEnviando(false)
    }
  }

  if (pedidoConfirmado) {
    return <ResumenConfirmacion pedido={pedidoConfirmado} />
  }

  if (!producto || !seleccion) {
    return (
      <div className="contenedor py-24 text-center">
        <p className="text-marron/70">
          No encontramos un producto personalizado. Vuelve al{' '}
          <Link to="/catalogo" className="underline">catálogo</Link> para elegir uno.
        </p>
      </div>
    )
  }

  return (
    <section className="contenedor grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <form onSubmit={manejarEnvio} noValidate className="space-y-10">
        <div>
          <Link to="/personalizar" className="text-sm text-marron/60 hover:text-marron-oscuro">
            ← Volver a personalizar
          </Link>
          <h1 className="mt-4 text-3xl">Datos de entrega</h1>
          {cliente ? (
            <p className="mt-1 text-sm text-marron/60">
              Comprando como <strong className="text-marron-oscuro">{cliente.nombre}</strong>. Este pedido
              quedará guardado en tu historial.
            </p>
          ) : (
            <p className="mt-1 text-sm text-marron/60">
              Comprando como invitado.{' '}
              <Link to="/cuenta/entrar" className="underline">
                Inicia sesión
              </Link>{' '}
              o{' '}
              <Link to="/cuenta/crear" className="underline">
                crea una cuenta
              </Link>{' '}
              para que tus próximos pedidos queden guardados en tu historial.
            </p>
          )}
        </div>

        <div className="space-y-5 rounded-2xl border border-marron/10 bg-white/60 p-6">
          <CampoTexto
            etiqueta="Nombre completo"
            valor={campos.nombre}
            onCambiar={(v) => actualizarCampo('nombre', v)}
            error={errores.nombre}
            placeholder="Ej: Laura Gómez"
          />
          <CampoTexto
            etiqueta="Teléfono de WhatsApp"
            valor={campos.telefono}
            onCambiar={(v) => actualizarCampo('telefono', v)}
            error={errores.telefono}
            placeholder="Ej: 3001234567"
            tipo="tel"
          />
          <CampoTexto
            etiqueta="Dirección de entrega o retiro en local"
            valor={campos.direccion}
            onCambiar={(v) => actualizarCampo('direccion', v)}
            error={errores.direccion}
            placeholder="Barrio, calle, número, o 'Retiro en local'"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <CampoTexto
              etiqueta="Fecha solicitada de entrega"
              valor={campos.fechaEntrega}
              onCambiar={(v) => actualizarCampo('fechaEntrega', v)}
              error={errores.fechaEntrega}
              tipo="date"
              min={fechaMinimaEntrega()}
            />
          </div>
          <CampoTexto
            etiqueta="Notas especiales de decoración (opcional)"
            valor={campos.notas}
            onCambiar={(v) => actualizarCampo('notas', v)}
            placeholder="Ej: escribir 'Feliz cumpleaños Sofía' en la torta"
            multilinea
          />
        </div>

        <div className="space-y-5">
          <h2 className="text-xl">Pago por transferencia</h2>
          <InformacionPago />
          <CargaComprobante
            archivo={comprobante}
            error={errores.comprobante || errorComprobante}
            onCambiar={(archivo, error) => {
              setComprobante(archivo)
              setErrorComprobante(error)
              if (!error) setErrores((anterior) => ({ ...anterior, comprobante: undefined }))
            }}
          />
        </div>

        {errorEnvio && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorEnvio}</p>
        )}

        <button type="submit" disabled={enviando} className="btn-primario w-full disabled:opacity-60">
          {enviando ? 'Enviando pedido…' : 'Confirmar pedido'}
        </button>
      </form>

      <aside className="sticky top-28 rounded-2xl border border-marron/10 bg-white/70 p-6">
        <h2 className="text-lg">Tu pedido</h2>
        <p className="mt-3 font-body text-base text-marron-oscuro">{resumenProducto?.nombreProducto}</p>
        <ul className="mt-2 space-y-1 text-sm text-marron/70">
          {resumenProducto?.lineas.map((linea) => (
            <li key={linea}>{linea}</li>
          ))}
        </ul>
        <div className="mt-4 flex items-baseline justify-between border-t border-marron/10 pt-4">
          <span className="text-sm text-marron/60">Total a transferir</span>
          <span className="text-2xl text-marron-oscuro">{formatearCOP(resumenProducto?.total ?? 0)}</span>
        </div>
      </aside>
    </section>
  )
}

function CampoTexto({ etiqueta, valor, onCambiar, error, placeholder, tipo = 'text', min, multilinea }) {
  const clases = `mt-1.5 w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-marron placeholder:text-marron/40 focus:border-rosa-intenso ${
    error ? 'border-red-400' : 'border-marron/15'
  }`

  return (
    <label className="block text-sm font-semibold text-marron-oscuro">
      {etiqueta}
      {multilinea ? (
        <textarea
          value={valor}
          onChange={(evento) => onCambiar(evento.target.value)}
          placeholder={placeholder}
          rows={3}
          className={clases}
        />
      ) : (
        <input
          type={tipo}
          value={valor}
          min={min}
          onChange={(evento) => onCambiar(evento.target.value)}
          placeholder={placeholder}
          className={clases}
        />
      )}
      {error && <span className="mt-1 block text-xs font-normal text-red-700">{error}</span>}
    </label>
  )
}

function ResumenConfirmacion({ pedido }) {
  return (
    <section className="contenedor max-w-2xl py-20 text-center">
      <span className="text-4xl" aria-hidden="true">🎉</span>
      <h1 className="mt-4 text-3xl">¡Pedido registrado!</h1>
      <p className="mt-2 text-marron/70">
        Quedó en estado <strong className="text-marron-oscuro">{pedido.estado_pedido}</strong>. Kelly revisará
        tu comprobante y te confirmará por WhatsApp.
      </p>

      <div className="mt-8 rounded-2xl border border-marron/15 bg-white/60 p-6 text-left">
        <p className="text-xs uppercase tracking-wide text-marron/50">Código de seguimiento</p>
        <p className="mt-1 font-display text-2xl italic text-marron-oscuro">{pedido.codigo_seguimiento}</p>

        <dl className="mt-6 space-y-3 text-sm text-marron/75">
          <div className="flex justify-between gap-4">
            <dt>Producto</dt>
            <dd className="text-right">{pedido.producto_resumen}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Total</dt>
            <dd className="text-right">{formatearCOP(pedido.total)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Entrega a</dt>
            <dd className="text-right">{pedido.cliente_nombre}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Dirección</dt>
            <dd className="text-right">{pedido.direccion}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Fecha de entrega</dt>
            <dd className="text-right">{pedido.fecha_entrega}</dd>
          </div>
        </dl>
      </div>

      <Link to="/" className="btn-secundario mt-8 inline-flex">
        Volver al inicio
      </Link>
    </section>
  )
}
