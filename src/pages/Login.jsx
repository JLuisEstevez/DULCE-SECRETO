import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  const navigate = useNavigate()
  // Intentamos obtener iniciarSesion del contexto de Staff si existe
  const auth = useAuth?.()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setCargando(true)

    try {
      if (auth?.iniciarSesion) {
        // Método 1: Por contexto oficial de la aplicación
        await auth.iniciarSesion(email, password)
        navigate('/admin')
      } else {
        // Método 2: Petición directa al endpoint del staff
        const respuesta = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })

        const datos = await respuesta.json()

        if (!respuesta.ok) {
          throw new Error(datos.error || 'Credenciales inválidas')
        }

        // Guardar token oficial de Staff (ds_token)
        localStorage.setItem('ds_token', datos.token)

        // Redirección total y limpia a /admin sin carreras de recarga
        window.location.href = '/admin'
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)] w-full items-center justify-center bg-crema-dulce/30 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl sm:p-12">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold tracking-tight text-marron sm:text-3xl">
            Acceso Administrativo
          </h1>
          <p className="mt-2 text-sm text-marron/60">
            Panel exclusivo para el equipo de Dulce Secreto.
          </p>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-marron/70">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kelly@dulcesecreto.co"
              className="mt-1.5 w-full rounded-xl border border-marron/20 bg-white px-4 py-3 text-sm text-marron focus:border-rosa-pastel focus:outline-none focus:ring-1 focus:ring-rosa-pastel"
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
              className="mt-1.5 w-full rounded-xl border border-marron/20 bg-white px-4 py-3 text-sm text-marron focus:border-rosa-pastel focus:outline-none focus:ring-1 focus:ring-rosa-pastel"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="mt-4 w-full rounded-full bg-marron py-3 text-sm font-semibold text-white transition hover:bg-marron/90 disabled:opacity-50"
          >
            {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}