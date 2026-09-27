import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function LoginCliente() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [mostrarFormularioEmail, setMostrarFormularioEmail] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setCargando(true)

    try {
      const respuesta = await fetch('/api/clientes/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.error || 'Credenciales inválidas')
      }

      // Guardar token independiente de cliente
      localStorage.setItem('ds_cliente_token', datos.token)
      if (datos.cliente) {
        localStorage.setItem('ds_cliente_datos', JSON.stringify(datos.cliente))
      }

      navigate('/cuenta/pedidos')
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)] w-full items-stretch justify-center bg-white">
      {/* ========================================================= */}
      {/* COLUMNA IZQUIERDA: Banner Publicitario / Imagen Propia   */}
      {/* ========================================================= */}
      <div className="relative hidden w-1/2 overflow-hidden bg-marron lg:block">
        <img
          src="/banner-login.jpg"
          onError={(e) => {
            e.currentTarget.src = '/tortavainilla.jpg'
          }}
          alt="Dulce Secreto Promoción"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/25 to-transparent p-12 text-white">
          <span className="text-xs font-semibold uppercase tracking-widest text-rosa-pastel">
            Estrategia El Secreto
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold leading-tight">
            ¡Obsequio Secreto VIP!
          </h2>
          <p className="mt-2 max-w-md text-sm text-crema-dulce/90">
            En compras superiores a $50.000 COP recibe una muestra exclusiva de nuestra nueva línea de galletas artesanales.
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* COLUMNA DERECHA: Botonera e Ingreso                      */}
      {/* ========================================================= */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          
          <div className="text-center sm:text-left">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-marron sm:text-3xl">
              Regístrate o ingresa para continuar
            </h1>
            <p className="mt-2 text-sm text-marron/60">
              Accede a tu historial de pedidos y personalizaciones guardadas.
            </p>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Botones de Acceso Rápido estilo Rappi */}
          <div className="mt-8 flex flex-col gap-3.5">
            {/* Botón Google */}
            <button
              type="button"
              onClick={() => alert('Próximamente: Inicio con Google')}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-[#1877F2] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#166fe5]"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[#1877F2]">
                G
              </span>
              <span>Continuar con Google</span>
            </button>

            {/* Botón Celular / WhatsApp */}
            <a
              href="https://wa.me/573105357830?text=Hola,%20quisiera%20consultar%20mi%20cuenta%20de%20cliente"
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#20ba5a]"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z"/>
              </svg>
              <span>Continuar con tu celular</span>
            </a>

            {/* Botón Facebook */}
            <button
              type="button"
              onClick={() => alert('Próximamente: Inicio con Facebook')}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-[#1877F2] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#166fe5]"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
              </svg>
              <span>Continuar con Facebook</span>
            </button>

            {/* Botón Apple */}
            <button
              type="button"
              onClick={() => alert('Próximamente: Inicio con Apple')}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-black py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.61 1.34-.55.63-1.03 1.66-.9 2.68 1.01.08 2.01-.49 2.59-1.17z"/>
              </svg>
              <span>Continuar con Apple</span>
            </button>

            {/* Alternar a login tradicional */}
            <button
              type="button"
              onClick={() => setMostrarFormularioEmail(!mostrarFormularioEmail)}
              className="mt-2 flex w-full items-center justify-center rounded-full border border-emerald-500 py-3 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
            >
              {mostrarFormularioEmail ? 'Ocultar correo' : 'Ingresar con correo y contraseña'}
            </button>
          </div>

          {/* Formulario tradicional */}
          {mostrarFormularioEmail && (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 border-t border-marron/10 pt-6">
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
                  className="mt-1.5 w-full rounded-xl border border-marron/20 bg-white px-4 py-2.5 text-sm text-marron focus:border-rosa-pastel focus:outline-none"
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
                  placeholder="••••••••"
                  className="mt-1.5 w-full rounded-xl border border-marron/20 bg-white px-4 py-2.5 text-sm text-marron focus:border-rosa-pastel focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="mt-2 w-full rounded-full bg-marron py-3 text-sm font-semibold text-white transition hover:bg-marron/90 disabled:opacity-50"
              >
                {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
              </button>
            </form>
          )}

          {/* Enlace a Registro */}
          <div className="mt-8 text-center text-sm text-marron/70">
            ¿No tienes cuenta todavía?{' '}
            <Link to="/cuenta/crear" className="font-semibold text-marron underline hover:text-rosa-pastel">
              Regístrate aquí
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}