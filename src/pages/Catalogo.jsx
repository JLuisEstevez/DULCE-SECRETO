import { useEffect, useMemo, useState } from 'react'
import { obtenerProductos } from '../services/api.js'
import TarjetaProducto from '../components/TarjetaProducto.jsx'

export default function Catalogo() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')

  useEffect(() => {
    let activo = true

    obtenerProductos()
      .then((datos) => {
        if (activo) setProductos(datos)
      })
      .catch((error) => {
        if (activo) setError(error.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [])

  const categorias = useMemo(
    () => ['Todas', ...new Set(productos.map((producto) => producto.categoria))],
    [productos]
  )

  const productosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()

    return productos.filter((producto) => {
      const coincideCategoria =
        categoriaActiva === 'Todas' || producto.categoria === categoriaActiva
      const coincideBusqueda =
        termino === '' || producto.nombre.toLowerCase().includes(termino)

      return coincideCategoria && coincideBusqueda
    })
  }, [productos, busqueda, categoriaActiva])

  return (
    <section className="contenedor py-14">
      <header className="max-w-xl">
        <h1 className="text-3xl">Catálogo</h1>
        <p className="mt-2 text-marron/70">
          Explora nuestras tortas, postres individuales y galletas. Elige una para personalizarla.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <input
            type="search"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            placeholder="Buscar por nombre..."
            aria-label="Buscar productos"
            className="w-full rounded-full border border-marron/15 bg-white px-5 py-3 text-sm text-marron placeholder:text-marron/40 focus:border-rosa-intenso"
          />
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              onClick={() => setCategoriaActiva(categoria)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                categoriaActiva === categoria
                  ? 'border-marron bg-marron text-crema-suave'
                  : 'border-marron/15 text-marron/75 hover:border-marron/35'
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>

      {cargando && <p className="mt-14 text-center text-marron/50">Cargando catálogo...</p>}

      {error && !cargando && (
        <p className="mt-14 text-center text-red-700">
          {error} Verifica que el servidor backend esté corriendo en el puerto 4000.
        </p>
      )}

      {!cargando && !error && productosFiltrados.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productosFiltrados.map((producto) => (
            <TarjetaProducto key={producto.id} producto={producto} />
          ))}
        </div>
      )}

      {!cargando && !error && productosFiltrados.length === 0 && (
        <div className="mt-16 text-center text-marron/60">
          <p>No encontramos productos que coincidan con tu búsqueda.</p>
        </div>
      )}
    </section>
  )
}



