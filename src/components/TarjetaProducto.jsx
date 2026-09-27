import { Link } from 'react-router-dom'
import { formatearCOP } from '../utils/formato.js'
import { iconoDeCategoria } from '../utils/categoriaIcono.js'

export default function TarjetaProducto({ producto }) {
  const destinoPersonalizar = producto.personalizable
    ? `/personalizar?producto=${producto.id}`
    : `/personalizar?producto=${producto.id}&modo=simple`

  
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
          <Link
            to={destinoPersonalizar}
            state={{ producto }}
            className="btn-secundario !px-4 !py-2 text-xs"
          >
            Personalizar
          </Link>
        </div>
      </div>
    </article>
  )
}
