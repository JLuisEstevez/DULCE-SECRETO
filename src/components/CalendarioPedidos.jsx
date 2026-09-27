import { useMemo, useState } from 'react'
import {
  aClaveFecha,
  diasDeSemana,
  esMismoDia,
  inicioDeSemana,
  matrizMensual,
  nombreDiaCorto,
  nombreMesAnio,
  sumarMeses,
  sumarSemanas
} from '../utils/fechas.js'
import TarjetaPedido from './TarjetaPedido.jsx'

export default function CalendarioPedidos({ pedidos, onSeleccionarPedido }) {
  const [modo, setModo] = useState('semana')
  const [fechaBase, setFechaBase] = useState(new Date())
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)

  const pedidosPorFecha = useMemo(() => {
    const mapa = new Map()
    for (const pedido of pedidos) {
      const lista = mapa.get(pedido.fecha_entrega) ?? []
      lista.push(pedido)
      mapa.set(pedido.fecha_entrega, lista)
    }
    return mapa
  }, [pedidos])

  function pedidosDelDia(fecha) {
    return pedidosPorFecha.get(aClaveFecha(fecha)) ?? []
  }

  function irHoy() {
    setFechaBase(new Date())
    setDiaSeleccionado(null)
  }

  function navegar(direccion) {
    setFechaBase((actual) =>
      modo === 'semana' ? sumarSemanas(actual, direccion) : sumarMeses(actual, direccion)
    )
  }

  const hoy = new Date()

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navegar(-1)} className="btn-secundario !px-3 !py-2 text-xs">
            ← Anterior
          </button>
          <button type="button" onClick={irHoy} className="btn-secundario !px-3 !py-2 text-xs">
            Hoy
          </button>
          <button type="button" onClick={() => navegar(1)} className="btn-secundario !px-3 !py-2 text-xs">
            Siguiente →
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-marron/70">
            {modo === 'semana'
              ? `Semana del ${aClaveFecha(inicioDeSemana(fechaBase))}`
              : nombreMesAnio(fechaBase)}
          </span>
          <div className="flex overflow-hidden rounded-full border border-marron/15 text-xs">
            <button
              type="button"
              onClick={() => setModo('semana')}
              className={`px-3 py-1.5 ${modo === 'semana' ? 'bg-marron text-crema-suave' : 'text-marron/70'}`}
            >
              Semana
            </button>
            <button
              type="button"
              onClick={() => setModo('mes')}
              className={`px-3 py-1.5 ${modo === 'mes' ? 'bg-marron text-crema-suave' : 'text-marron/70'}`}
            >
              Mes
            </button>
          </div>
        </div>
      </div>

      {modo === 'semana' ? (
        <div className="mt-6 grid gap-3 md:grid-cols-7">
          {diasDeSemana(fechaBase).map((dia) => {
            const pedidosDia = pedidosDelDia(dia)
            const esHoy = esMismoDia(dia, hoy)

            return (
              <div
                key={aClaveFecha(dia)}
                className={`rounded-2xl border p-3 ${
                  esHoy ? 'border-rosa-intenso bg-rosa/10' : 'border-marron/10 bg-white/40'
                }`}
              >
                <p className="text-xs text-marron/50">{nombreDiaCorto(dia)}</p>
                <p className="text-lg text-marron-oscuro">{dia.getDate()}</p>
                <div className="mt-3 flex flex-col gap-2">
                  {pedidosDia.length === 0 ? (
                    <p className="text-xs text-marron/35">Sin entregas</p>
                  ) : (
                    pedidosDia.map((pedido) => (
                      <TarjetaPedido key={pedido.id} pedido={pedido} onSeleccionar={onSeleccionarPedido} />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="mt-6">
          <div className="grid grid-cols-7 gap-2 text-center text-xs text-marron/50">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((etiqueta) => (
              <span key={etiqueta}>{etiqueta}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {matrizMensual(fechaBase).map((dia) => {
              const pedidosDia = pedidosDelDia(dia)
              const delMesActual = dia.getMonth() === fechaBase.getMonth()
              const esHoy = esMismoDia(dia, hoy)
              const clave = aClaveFecha(dia)

              return (
                <button
                  key={clave}
                  type="button"
                  onClick={() => setDiaSeleccionado(clave)}
                  className={`flex aspect-square flex-col items-center justify-center rounded-xl border text-sm transition-colors ${
                    diaSeleccionado === clave
                      ? 'border-marron bg-marron text-crema-suave'
                      : esHoy
                        ? 'border-rosa-intenso bg-rosa/15 text-marron-oscuro'
                        : 'border-marron/10 text-marron/70 hover:border-marron/30'
                  } ${!delMesActual ? 'opacity-35' : ''}`}
                >
                  <span>{dia.getDate()}</span>
                  {pedidosDia.length > 0 && (
                    <span
                      className={`mt-1 h-1.5 w-1.5 rounded-full ${
                        diaSeleccionado === clave ? 'bg-crema-suave' : 'bg-rosa-intenso'
                      }`}
                    />
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-marron-oscuro">
              {diaSeleccionado ? `Entregas del ${diaSeleccionado}` : 'Selecciona un día para ver sus entregas'}
            </h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {diaSeleccionado &&
                (pedidosPorFecha.get(diaSeleccionado) ?? []).map((pedido) => (
                  <TarjetaPedido key={pedido.id} pedido={pedido} onSeleccionar={onSeleccionarPedido} />
                ))}
              {diaSeleccionado && (pedidosPorFecha.get(diaSeleccionado) ?? []).length === 0 && (
                <p className="text-sm text-marron/50">No hay entregas programadas este día.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
