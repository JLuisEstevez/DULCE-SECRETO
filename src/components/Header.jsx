import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useClienteAuth } from '../context/ClienteAuthContext.jsx'

const enlaces = [
  { etiqueta: 'Catálogo', destino: '/catalogo' },
  { etiqueta: 'Cómo pedir', destino: '/#como-pedir' },
  { etiqueta: 'Contacto', destino: '/#contacto' }
]

function EnlaceCuenta({ alHacerClic }) {
  const { cliente } = useClienteAuth()

  if (cliente) {
    return (
      <Link
        to="/cuenta/pedidos"
        onClick={alHacerClic}
        className="flex items-center gap-2 text-sm text-marron/80 hover:text-marron-oscuro"
      >
        {cliente.foto_url ? (
          <img src={cliente.foto_url} alt="" className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rosa/50 text-xs font-semibold text-marron-oscuro">
            {cliente.nombre[0]?.toUpperCase()}
          </span>
        )}
        Mis pedidos
      </Link>
    )
  }

  return (
    <Link to="/cuenta/entrar" onClick={alHacerClic} className="text-sm text-marron/80 hover:text-marron-oscuro">
      Iniciar sesión
    </Link>
  )
}

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-marron/10 bg-crema-suave/95 backdrop-blur">
      <div className="contenedor flex h-20 items-center justify-between">
        <Link 
  to="/" 
  className="group flex items-center gap-3 leading-none" 
  onClick={() => setMenuAbierto(false)}
>
  {/* Casilla para el logo PNG sin fondo */}
  <img
    src="/isotipo.png"
    alt="Logo Dulce Secreto"
    className="h-9 w-9 sm:h-10 sm:w-10 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
    onError={(e) => {
      e.currentTarget.style.display = 'none'
    }}
  />

  {/* Tu tipografía italiana intacta */}
  <div className="flex flex-col">
    <span className="font-display text-2xl italic text-marron-oscuro">
      Dulce Secreto
    </span>
    <span className="mt-1 h-px w-0 bg-rosa-intenso transition-all duration-300 group-hover:w-full" />
  </div>
</Link>

        <nav className="hidden items-center gap-10 md:flex">
          {enlaces.map((enlace) => (
            <NavLink
              key={enlace.destino}
              to={enlace.destino}
              className={({ isActive }) =>
                `text-sm text-marron/80 transition-colors hover:text-marron-oscuro ${
                  isActive ? 'text-marron-oscuro' : ''
                }`
              }
            >
              {enlace.etiqueta}
            </NavLink>
          ))}
          <EnlaceCuenta />
          <Link to="/personalizar" className="btn-primario">
            Personaliza tu torta
          </Link>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-marron/15 md:hidden"
          aria-expanded={menuAbierto}
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          <span className="relative block h-3.5 w-4">
            <span
              className={`absolute left-0 top-0 h-px w-4 bg-marron-oscuro transition-transform ${
                menuAbierto ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-marron-oscuro transition-opacity ${
                menuAbierto ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-4 bg-marron-oscuro transition-transform ${
                menuAbierto ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </div>

      {menuAbierto && (
        <nav className="border-t border-marron/10 bg-crema-suave md:hidden">
          <div className="contenedor flex flex-col gap-1 py-4">
            {enlaces.map((enlace) => (
              <Link
                key={enlace.destino}
                to={enlace.destino}
                className="rounded-lg px-2 py-3 text-marron/85 hover:bg-rosa/20"
                onClick={() => setMenuAbierto(false)}
              >
                {enlace.etiqueta}
              </Link>
            ))}
            <div className="mt-1 border-t border-marron/10 pt-3">
              <EnlaceCuenta alHacerClic={() => setMenuAbierto(false)} />
            </div>
            <Link
              to="/personalizar"
              className="btn-primario mt-2 w-full"
              onClick={() => setMenuAbierto(false)}
            >
              Personaliza tu torta
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
