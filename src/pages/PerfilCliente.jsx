import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useClienteAuth } from '../context/ClienteAuthContext.jsx'
import { actualizarPerfilCliente, subirFotoPerfilCliente } from '../services/api.js'
import AvatarPerfil from '../components/AvatarPerfil.jsx'

export default function PerfilCliente() {
  const { cliente, actualizarClienteLocal, cerrarSesion } = useClienteAuth()

  const [nombre, setNombre] = useState(cliente.nombre)
  const [email, setEmail] = useState(cliente.email)
  const [telefono, setTelefono] = useState(cliente.telefono || '')
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [subiendoFoto, setSubiendoFoto] = useState(false)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(false)

  async function manejarSubirFoto(archivo) {
    setSubiendoFoto(true)
    setError(null)
    try {
      const actualizado = await subirFotoPerfilCliente(archivo)
      actualizarClienteLocal(actualizado)
    } catch (error) {
      setError(error.message)
    } finally {
      setSubiendoFoto(false)
    }
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError(null)
    setExito(false)
    setGuardando(true)

    try {
      const cambios = { nombre, email, telefono }
      if (passwordNueva) {
        cambios.passwordActual = passwordActual
        cambios.passwordNueva = passwordNueva
      }
      const actualizado = await actualizarPerfilCliente(cambios)
      actualizarClienteLocal(actualizado)
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
      <div className="flex items-center justify-between">
        <Link to="/cuenta/pedidos" className="text-sm text-marron/60 hover:text-marron-oscuro">
          ← Mis pedidos
        </Link>
        <button type="button" onClick={cerrarSesion} className="text-sm text-red-700 hover:text-red-800">
          Cerrar sesión
        </button>
      </div>

      <div className="mt-6 flex justify-center">
        <AvatarPerfil
          fotoUrl={cliente.foto_url}
          nombre={cliente.nombre}
          onSubir={manejarSubirFoto}
          subiendo={subiendoFoto}
        />
      </div>

      <h1 className="mt-4 text-center text-3xl">Mi cuenta</h1>

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

        <label className="block text-sm font-semibold text-marron-oscuro">
          WhatsApp
          <input
            type="tel"
            value={telefono}
            onChange={(evento) => setTelefono(evento.target.value)}
            placeholder="Ej: 3001234567"
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
