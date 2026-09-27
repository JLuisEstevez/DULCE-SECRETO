import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { actualizarPerfilStaff } from '../services/api.js'

export default function Perfil() {
  const { usuario, actualizarUsuarioLocal } = useAuth()

  const [nombre, setNombre] = useState(usuario.nombre)
  const [email, setEmail] = useState(usuario.email)
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(false)

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError(null)
    setExito(false)
    setGuardando(true)

    try {
      const cambios = { nombre, email }
      if (passwordNueva) {
        cambios.passwordActual = passwordActual
        cambios.passwordNueva = passwordNueva
      }
      const actualizado = await actualizarPerfilStaff(cambios)
      actualizarUsuarioLocal(actualizado)
      setPasswordActual('')
      setPasswordNueva('')
      setExito(true)
    } catch (error) {
      setError(error.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section className="contenedor max-w-lg py-10">
      <Link to="/admin" className="text-sm text-marron/60 hover:text-marron-oscuro">
        ← Volver al panel
      </Link>
      <h1 className="mt-4 text-3xl">Mi perfil</h1>
      <p className="mt-1 text-marron/70">
        Rol: <span className="font-medium text-marron-oscuro">{usuario.rol}</span>
      </p>

      <form onSubmit={manejarEnvio} noValidate className="mt-8 space-y-5 rounded-2xl border border-marron/10 bg-white/60 p-6">
        <label className="block text-sm font-semibold text-marron-oscuro">
          Nombre
          <input
            type="text"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            className="mt-1.5 w-full rounded-xl border border-marron/15 bg-white px-4 py-2.5 text-sm focus:border-rosa-intenso"
          />
        </label>

        <label className="block text-sm font-semibold text-marron-oscuro">
          Correo
          <input
            type="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            className="mt-1.5 w-full rounded-xl border border-marron/15 bg-white px-4 py-2.5 text-sm focus:border-rosa-intenso"
          />
        </label>

        <div className="border-t border-marron/10 pt-5">
          <p className="text-sm font-semibold text-marron-oscuro">Cambiar contraseña (opcional)</p>
          <div className="mt-3 space-y-3">
            <input
              type="password"
              value={passwordActual}
              onChange={(evento) => setPasswordActual(evento.target.value)}
              placeholder="Contraseña actual"
              className="w-full rounded-xl border border-marron/15 bg-white px-4 py-2.5 text-sm focus:border-rosa-intenso"
            />
            <input
              type="password"
              value={passwordNueva}
              onChange={(evento) => setPasswordNueva(evento.target.value)}
              placeholder="Contraseña nueva (mín. 8 caracteres)"
              className="w-full rounded-xl border border-marron/15 bg-white px-4 py-2.5 text-sm focus:border-rosa-intenso"
            />
          </div>
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {exito && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">Perfil actualizado.</p>}

        <button type="submit" disabled={guardando} className="btn-primario w-full disabled:opacity-60">
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </section>
  )
}
