import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useClienteAuth } from '../context/ClienteAuthContext.jsx'
import BotonGoogle from '../components/BotonGoogle.jsx'

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

        <BotonGoogle onCredential={manejarGoogle} texto="signin_with" />

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
