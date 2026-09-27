import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { obtenerProductos, obtenerOpcionesPersonalizacion } from '../services/api.js'
import GrupoOpciones from '../components/GrupoOpciones.jsx'
import GrupoToppings from '../components/GrupoToppings.jsx'
import { formatearCOP } from '../utils/formato.js'
import { iconoDeCategoria } from '../utils/categoriaIcono.js'

export default function Personalizador() {
  const [parametros] = useSearchParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  const idProducto = parametros.get('producto')

  const [producto, setProducto] = useState(state?.producto ?? null)
  const [opciones, setOpciones] = useState(null)
  const [cargando, setCargando] = useState(!state?.producto)
  const [error, setError] = useState(null)

  // --- Modo completo: tortas personalizables (HU-02) ---
  const [porcionesId, setPorcionesId] = useState('')
  const [saborId, setSaborId] = useState('')
  const [rellenoId, setRellenoId] = useState('')
  const [toppingsIds, setToppingsIds] = useState([])

  // --- Modo simple: postres individuales / galletas (por cantidad) ---
  const [cantidad, setCantidad] = useState(1)

  // Si llegamos por URL directa (sin el state del catálogo), buscamos el
  // producto y las opciones en la API.
  useEffect(() => {
    let activo = true

    async function cargar() {
      try {
        const [productos, opcionesApi] = await Promise.all([
          producto ? Promise.resolve(null) : obtenerProductos(),
          obtenerOpcionesPersonalizacion()
        ])

        if (!activo) return

        if (productos) {
          const encontrado = productos.find((item) => item.id === idProducto) ?? productos[0]
          setProducto(encontrado)
        }
        setOpciones(opcionesApi)
      } catch (error) {
        if (activo) setError(error.message)
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargar()
    return () => {
      activo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (opciones && !porcionesId) {
      setPorcionesId(opciones.porciones[0]?.id ?? '')
      setSaborId(opciones.sabores[0]?.id ?? '')
      setRellenoId(opciones.rellenos[0]?.id ?? '')
    }
  }, [opciones, porcionesId])

  const resumen = useMemo(() => {
    if (!producto || !opciones) return null

    if (!producto.personalizable) {
      return {
        lineas: [`${cantidad} unidad(es)`],
        total: producto.precio_base * cantidad
      }
    }

    const porciones = opciones.porciones.find((o) => o.id === porcionesId)
    const sabor = opciones.sabores.find((o) => o.id === saborId)
    const relleno = opciones.rellenos.find((o) => o.id === rellenoId)
    const toppingsSeleccionados = opciones.toppings.filter((o) => toppingsIds.includes(o.id))

    if (!porciones || !sabor || !relleno) return null

    const baseEscalada = producto.precio_base * porciones.factor
    const costoToppings = toppingsSeleccionados.reduce((suma, t) => suma + t.costo_adicional, 0)
    const total = Math.round(baseEscalada + sabor.costo_adicional + relleno.costo_adicional + costoToppings)

    return {
      detalle: [
        { etiqueta: `Base (${porciones.nombre})`, costo: baseEscalada },
        { etiqueta: `Sabor: ${sabor.nombre}`, costo: sabor.costo_adicional },
        { etiqueta: `Relleno: ${relleno.nombre}`, costo: relleno.costo_adicional },
        ...toppingsSeleccionados.map((t) => ({ etiqueta: t.nombre, costo: t.costo_adicional }))
      ],
      lineas: [
        porciones.nombre,
        `Sabor: ${sabor.nombre}`,
        `Relleno: ${relleno.nombre}`,
        toppingsSeleccionados.length > 0
          ? `Toppings: ${toppingsSeleccionados.map((t) => t.nombre).join(', ')}`
          : 'Sin toppings adicionales'
      ],
      total
    }
  }, [producto, opciones, porcionesId, saborId, rellenoId, toppingsIds, cantidad])

  function manejarAnadirAlCarrito() {
    if (!resumen) return

    const seleccion = producto.personalizable
      ? { porcionesId, saborId, rellenoId, toppingsIds }
      : { cantidad }

    navigate('/checkout', {
      state: {
        producto,
        seleccion,
        resumen: { nombreProducto: producto.nombre, lineas: resumen.lineas, total: resumen.total }
      }
    })
  }

  if (cargando) {
    return <p className="contenedor py-24 text-center text-marron/50">Cargando personalizador...</p>
  }

  if (error || !producto || !opciones) {
    return (
      <div className="contenedor py-24 text-center text-red-700">
        <p>{error || 'No encontramos ese producto.'}</p>
        <Link to="/catalogo" className="mt-4 inline-block underline">Volver al catálogo</Link>
      </div>
    )
  }

  return (
    <section className="contenedor grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div>
        <Link to="/catalogo" className="text-sm text-marron/60 hover:text-marron-oscuro">
          ← Volver al catálogo
        </Link>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rosa/40 text-3xl">
            <span aria-hidden="true">{iconoDeCategoria(producto.categoria)}</span>
          </div>
          <div>
            <h1 className="text-2xl">{producto.nombre}</h1>
            <p className="text-sm text-marron/60">{producto.categoria}</p>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {producto.personalizable ? (
            <>
              <GrupoOpciones
                etiqueta="Porciones"
                nombre="porciones"
                opciones={opciones.porciones}
                valorSeleccionado={porcionesId}
                onCambiar={setPorcionesId}
              />
              <GrupoOpciones
                etiqueta="Sabor de bizcocho"
                nombre="sabor"
                opciones={opciones.sabores}
                valorSeleccionado={saborId}
                onCambiar={setSaborId}
              />
              <GrupoOpciones
                etiqueta="Relleno"
                nombre="relleno"
                opciones={opciones.rellenos}
                valorSeleccionado={rellenoId}
                onCambiar={setRellenoId}
              />
              <GrupoToppings
                opciones={opciones.toppings}
                seleccionados={toppingsIds}
                onCambiar={setToppingsIds}
              />
            </>
          ) : (
            <fieldset>
              <legend className="text-sm font-semibold text-marron-oscuro">Cantidad</legend>
              <div className="mt-3 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  className="h-10 w-10 rounded-full border border-marron/20 text-lg"
                  aria-label="Restar unidad"
                >
                  −
                </button>
                <span className="w-8 text-center text-lg">{cantidad}</span>
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.min(24, c + 1))}
                  className="h-10 w-10 rounded-full border border-marron/20 text-lg"
                  aria-label="Sumar unidad"
                >
                  +
                </button>
              </div>
            </fieldset>
          )}
        </div>
      </div>

      <aside className="sticky top-28 rounded-2xl border border-marron/10 bg-white/70 p-6">
        <h2 className="text-lg">Resumen del pedido</h2>
        {resumen ? (
          <>
            <ul className="mt-4 space-y-2 text-sm text-marron/75">
              {(resumen.detalle ?? resumen.lineas.map((l) => ({ etiqueta: l, costo: 0 }))).map((linea) => (
                <li key={linea.etiqueta} className="flex justify-between gap-4">
                  <span>{linea.etiqueta}</span>
                  {linea.costo > 0 && <span>+{formatearCOP(linea.costo)}</span>}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-baseline justify-between border-t border-marron/10 pt-4">
              <span className="text-sm text-marron/60">Total</span>
              <span className="text-2xl text-marron-oscuro">{formatearCOP(resumen.total)}</span>
            </div>

            <button type="button" onClick={manejarAnadirAlCarrito} className="btn-primario mt-6 w-full">
              Añadir al carrito / Ir a pago
            </button>
          </>
        ) : (
          <p className="mt-4 text-sm text-marron/50">Elige las opciones para calcular el precio.</p>
        )}
      </aside>
    </section>
  )
}
