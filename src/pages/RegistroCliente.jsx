import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function RegistroCliente() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setCargando(true)

    try {
      const respuesta = await fetch('/api/clientes/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, telefono, password })
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo crear la cuenta')
      }

      localStorage.setItem('ds_cliente_token', datos.token)
      if (datos.cliente) {
        localStorage.setItem('ds_cliente_datos', JSON.stringify(datos.cliente))
      }

      navigate('/cuenta/pedidos')
    } catch (err) {
      setError(err.message || 'Error al registrar la cuenta')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)] w-full items-stretch justify-center bg-white">
      {/* ========================================================= */}
      {/* COLUMNA IZQUIERDA: Banner Publicitario / Imagen Propia   */}
      {/* ========================================================= */}
      <div className="relative hidden w-1/2 overflow-hidden bg-marron-oscuro lg:block">
        <img
          src="/banner-login.jpg"
          onError={(e) => {
            e.currentTarget.src = '/tortavainilla.jpg'
          }}
          alt="Comunidad Dulce Secreto"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/30 to-transparent p-12 text-white">
          <span className="text-xs font-semibold uppercase tracking-widest text-rosa-pastel">
            Comunidad Dulce Secreto
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold leading-tight">
            Crea tu cuenta y vive la experiencia
          </h2>
          <p className="mt-2 max-w-md text-sm text-crema-dulce/90">
            Guarda tus recetas preferidas, haz seguimiento a tus pedidos y recibe una muestra exclusiva en compras superiores a $50.000 COP.
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* COLUMNA DERECHA: Opciones (Google, Apple y Correo)        */}
      {/* ========================================================= */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          
          <div className="text-center sm:text-left">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-marron sm:text-3xl">
              Crea tu cuenta para continuar
            </h1>
            <p className="mt-2 text-sm text-marron/60">
              Disfruta de una experiencia personalizada en repostería artesanal.
            </p>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Botonera de Registro Rápido */}
          <div className="mt-8 flex flex-col gap-3.5">
            {/* Botón Google con isotipo oficial multicolor */}
            <button
              type="button"
              onClick={() => alert('Próximamente: Registro con Google OAuth')}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-marron/20 bg-white py-3 text-sm font-semibold text-marron shadow-sm transition hover:bg-neutral-50 active:scale-[0.99]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuar con Google</span>
            </button>

            {/* Botón Apple con logotipo oficial de la manzana */}
            <button
              type="button"
              onClick={() => alert('Próximamente: Registro con Apple ID')}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-black py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 active:scale-[0.99]"
            >
              <svg className="h-5 w-5 fill-current text-white" viewBox="0 0 170 170" aria-hidden="true">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.66-7.74-11.89-14.1-6.19-9.35-11.05-20.08-14.58-32.18-3.53-12.1-5.3-23.75-5.3-34.95 0-14.42 3.65-26.65 10.96-36.68 7.31-10.04 16.59-15.17 27.84-15.39 4.13 0 9.07 1.15 14.82 3.45 5.75 2.3 9.49 3.51 11.22 3.62 1.3.11 5.37-1.2 12.22-3.93 6.85-2.73 12.39-3.95 16.63-3.66 12.61.65 22.84 5.38 30.68 14.2-11.09 6.74-16.53 16.14-16.31 28.2.22 9.57 3.97 17.58 11.25 24.03 7.28 6.45 15.93 10.05 25.95 10.79-2.4 7.4-5.22 14.77-8.47 22.12zM119.22 33.15c0-6.74 2.45-13.15 7.36-19.24 4.91-6.08 10.93-10.27 18.06-12.57.87 2.39 1.3 4.89 1.3 7.5 0 6.63-2.61 13.04-7.83 19.24-5.22 6.2-11.22 10.16-18 11.89-.33-2.17-.89-4.44-.89-6.82z" />
              </svg>
              <span>Continuar con Apple</span>
            </button>

            {/* Alternar a Registro Tradicional por Correo */}
            <button
              type="button"
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="flex w-full items-center justify-center rounded-full border border-marron/30 bg-marron py-3 text-sm font-semibold text-crema-suave transition hover:bg-marron/90 active:scale-[0.99]"
            >
              {mostrarFormulario ? 'Ocultar formulario' : 'Registrarse con correo electrónico'}
            </button>
          </div>

          {/* Formulario Tradicional Desplegable */}
          {mostrarFormulario && (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3.5 border-t border-marron/10 pt-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-marron/70">
                  Nombre completo
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre y apellido"
                  className="mt-1.5 w-full rounded-xl border border-marron/20 bg-white px-4 py-2.5 text-sm text-marron focus:border-rosa-intenso focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-marron/70">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="mt-1.5 w-full rounded-xl border border-marron/20 bg-white px-4 py-2.5 text-sm text-marron focus:border-rosa-intenso focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-marron/70">
                  WhatsApp (opcional)
                </label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="300 123 4567"
                  className="mt-1.5 w-full rounded-xl border border-marron/20 bg-white px-4 py-2.5 text-sm text-marron focus:border-rosa-intenso focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-marron/70">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="mt-1.5 w-full rounded-xl border border-marron/20 bg-white px-4 py-2.5 text-sm text-marron focus:border-rosa-intenso focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="mt-2 w-full rounded-full bg-rosa-intenso py-3 text-sm font-semibold text-white transition hover:bg-rosa-intenso/90 disabled:opacity-50"
              >
                {cargando ? 'Registrando...' : 'Completar Registro'}
              </button>
            </form>
          )}

          {/* Enlace a Login */}
          <div className="mt-8 text-center text-sm text-marron/70">
            ¿Ya tienes una cuenta creada?{' '}
            <Link to="/cuenta/entrar" className="font-semibold text-marron underline hover:text-rosa-intenso">
              Inicia sesión aquí
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}