import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useClienteAuth } from '../context/ClienteAuthContext.jsx'

export default function LoginCliente() {
  const { iniciarSesion, iniciarSesionConGoogle, cliente } = useClienteAuth()
  const navigate = useNavigate()
  const { state } = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (cliente) navigate(state?.desde || '/cuenta/pedidos', { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cliente])

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      await iniciarSesion(email, password)
    } catch (error) {
      setError(error.message)
    } finally {
      setEnviando(false)
    }
  }

  // Esta función queda lista por si luego conectas la lógica real de Google al botón
  async function manejarGoogle(credential) {
    setError(null)
    try {
      await iniciarSesionConGoogle(credential)
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <section className="contenedor flex min-h-[70vh] items-center justify-center py-14">
      <form onSubmit={manejarEnvio} noValidate className="w-full max-w-sm space-y-5">
        <div className="text-center">
          <span className="font-display text-2xl italic text-marron-oscuro">Dulce Secreto</span>
          <h1 className="mt-2 text-xl">Entra a tu cuenta</h1>
          <p className="mt-1 text-sm text-marron/60">Para ver el estado y el historial de tus pedidos.</p>
        </div>

        {/* Contenedor de botones sociales */}
        <div className="flex flex-col gap-3.5">
          
          {/* Botón Google full redondeado */}
          <button
            type="button"
            onClick={() => alert('Próximamente: Inicio con Google OAuth')}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-marron/20 bg-white py-3 text-sm font-semibold text-marron shadow-sm transition hover:bg-neutral-50 active:scale-[0.99]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continuar con Google</span>
          </button>

          {/* Botón Apple full redondeado con tu imagen PNG */}
          <button
            type="button"
            onClick={() => alert('Próximamente: Inicio con Apple')}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-black py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 active:scale-[0.99]"
          >
            <img 
              src="/apple.png" 
              alt="Logo Apple" 
              className="h-5 w-5 object-contain" 
            />
            <span>Continuar con Apple</span>
          </button>

        </div>

        <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-marron/40">
          <span className="h-px flex-1 bg-marron/15" />
          o con tu correo
          <span className="h-px flex-1 bg-marron/15" />
        </div>

        <label className="block text-sm font-semibold text-marron-oscuro">
          Correo
          <input
            type="email"
            required
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            placeholder="tucorreo@ejemplo.com"
            className="mt-1.5 w-full rounded-xl border border-marron/15 bg-white px-4 py-2.5 text-sm focus:border-rosa-intenso"
          />
        </label>

        <label className="block text-sm font-semibold text-marron-oscuro">
          Contraseña
          <input
            type="password"
            required
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
            placeholder="••••••••"
            className="mt-1.5 w-full rounded-xl border border-marron/15 bg-white px-4 py-2.5 text-sm focus:border-rosa-intenso"
          />
        </label>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <button type="submit" disabled={enviando} className="btn-primario w-full disabled:opacity-60">
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="text-center text-sm text-marron/60">
          ¿Aún no tienes cuenta?{' '}
          <Link to="/cuenta/crear" className="font-semibold text-marron-oscuro underline">
            Regístrate
          </Link>
        </p>
      </form>
    </section>
  )
}