import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { obtenerUsuariosAdmin, crearUsuarioAdmin, eliminarUsuarioAdmin } from '../services/api.js'

const CAMPOS_INICIALES = { nombre: '', email: '', password: '', rol: 'editor' }

export default function GestionUsuarios() {
  const { usuario: usuarioActual } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [campos, setCampos] = useState(CAMPOS_INICIALES)
  const [creando, setCreando] = useState(false)

  function cargarUsuarios() {
    setCargando(true)
    obtenerUsuariosAdmin()
      .then(setUsuarios)
      .catch((error) => setError(error.message))
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    if (usuarioActual.rol === 'admin') cargarUsuarios()
    else setCargando(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (usuarioActual.rol !== 'admin') {
    return (
      <section className="contenedor max-w-lg py-20 text-center">
        <p className="text-marron/70">Solo una cuenta administradora puede ver esta página.</p>
        <Link to="/admin" className="mt-4 inline-block underline">Volver al panel</Link>
      </section>
    )
  }

  async function manejarCrear(evento) {
    evento.preventDefault()
    setError(null)
    setCreando(true)
    try {
      await crearUsuarioAdmin(campos)
      setCampos(CAMPOS_INICIALES)
      cargarUsuarios()
    } catch (error) {
      setError(error.message)
    } finally {
      setCreando(false)
    }
  }

  async function manejarEliminar(id) {
    if (!confirm('¿Eliminar esta cuenta administrativa? No se puede deshacer.')) return
    try {
      await eliminarUsuarioAdmin(id)
      cargarUsuarios()
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <section className="contenedor max-w-3xl py-10">
      <Link to="/admin" className="text-sm text-marron/60 hover:text-marron-oscuro">
        ← Volver al panel
      </Link>
      <h1 className="mt-4 text-3xl">Usuarios del panel</h1>
      <p className="mt-1 text-marron/70">Quiénes pueden entrar a /admin y validar pedidos.</p>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <form onSubmit={manejarCrear} className="mt-8 grid gap-4 rounded-2xl border border-marron/10 bg-white/60 p-6 sm:grid-cols-2">
        <h2 className="sm:col-span-2 text-lg">Agregar nueva cuenta</h2>
        <input
          type="text"
          required
          placeholder="Nombre"
          value={campos.nombre}
          onChange={(e) => setCampos((c) => ({ ...c, nombre: e.target.value }))}
          className="rounded-xl border border-marron/15 bg-white px-4 py-2.5 text-sm focus:border-rosa-intenso"
        />
        <input
          type="email"
          required
          placeholder="Correo"
          value={campos.email}
          onChange={(e) => setCampos((c) => ({ ...c, email: e.target.value }))}
          className="rounded-xl border border-marron/15 bg-white px-4 py-2.5 text-sm focus:border-rosa-intenso"
        />
        <input
          type="password"
          required
          placeholder="Contraseña (mín. 8 caracteres)"
          value={campos.password}
          onChange={(e) => setCampos((c) => ({ ...c, password: e.target.value }))}
          className="rounded-xl border border-marron/15 bg-white px-4 py-2.5 text-sm focus:border-rosa-intenso"
        />
        <select
          value={campos.rol}
          onChange={(e) => setCampos((c) => ({ ...c, rol: e.target.value }))}
          className="rounded-xl border border-marron/15 bg-white px-4 py-2.5 text-sm focus:border-rosa-intenso"
        >
          <option value="editor">Editor (gestiona pedidos)</option>
          <option value="admin">Administrador (control total)</option>
        </select>
        <button type="submit" disabled={creando} className="btn-primario sm:col-span-2 disabled:opacity-60">
          {creando ? 'Creando...' : 'Crear cuenta'}
        </button>
      </form>

      <div className="mt-8">
        {cargando ? (
          <p className="text-center text-marron/50">Cargando usuarios...</p>
        ) : (
          <ul className="divide-y divide-marron/10 rounded-2xl border border-marron/10 bg-white/60">
            {usuarios.map((usuario) => (
              <li key={usuario.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-marron-oscuro">
                    {usuario.nombre}{' '}
                    {usuario.id === usuarioActual.id && (
                      <span className="text-xs text-marron/40">(tú)</span>
                    )}
                  </p>
                  <p className="text-sm text-marron/60">
                    {usuario.email} · {usuario.rol}
                  </p>
                </div>
                {usuario.id !== usuarioActual.id && (
                  <button
                    type="button"
                    onClick={() => manejarEliminar(usuario.id)}
                    className="text-sm text-red-700 underline underline-offset-2 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
