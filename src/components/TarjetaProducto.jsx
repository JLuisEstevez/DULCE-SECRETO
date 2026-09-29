import { Link } from 'react-router-dom'
import { formatearCOP } from '../utils/formato.js'
import { iconoDeCategoria } from '../utils/categoriaIcono.js'

export default function TarjetaProducto({ producto }) {
  const destinoPersonalizar = producto.personalizable
    ? `/personalizar?producto=${producto.id}`
    : `/personalizar?producto=${producto.id}&modo=simple`

  function manejarAgregarBolsa() {
    try {
      const guardados = localStorage.getItem('ds_carrito')
      const carrito = guardados ? JSON.parse(guardados) : []
      
      const indice = carrito.findIndex((item) => item.id === producto.id)
      if (indice >= 0) {
        carrito[indice].cantidad += 1
      } else {
        carrito.push({ ...producto, cantidad: 1 })
      }
      
      localStorage.setItem('ds_carrito', JSON.stringify(carrito))
      // Notifica al navegador que la bolsa se actualizó
      window.dispatchEvent(new Event('ds_carrito_actualizado'))
      alert(`Añadido a la bolsa: ${producto.nombre}`)
    } catch (e) {
      console.error('Error al guardar en el carrito:', e)
    }
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-marron/10 bg-white/60">
      <div className="flex aspect-[4/3] items-center justify-center bg-rosa/40 text-5xl overflow-hidden">
        {producto.imagen_url ? (
          <img 
            src={producto.imagen_url}
            alt={producto.nombre} 
            className="h-full w-full object-cover" 
          />
        ) : (
          <span aria-hidden="true">{iconoDeCategoria(producto.categoria)}</span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg leading-snug">{producto.nombre}</h3>
        <p className="text-sm text-marron/70">{producto.descripcion}</p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-body text-base font-semibold text-marron-oscuro">
            Desde {formatearCOP(producto.precio_base)}
          </span>

          <div className="flex items-center gap-2">
            {/* Botón limpio: sin bordes ni recuadro blanco, solo el icono */}
            <button
              type="button"
              onClick={manejarAgregarBolsa}
              className="p-1 transition-transform duration-200 hover:scale-110 active:scale-95"
              title="Añadir a la bolsa"
            >
              <img
                src="/Bolsa.png"
                alt="Añadir a la bolsa"
                className="h-6 w-6 object-contain"
              />
            </button>

            <Link
              to={destinoPersonalizar}
              state={{ producto }}
              className="btn-secundario !px-4 !py-2 text-xs"
            >
              Personalizar
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}