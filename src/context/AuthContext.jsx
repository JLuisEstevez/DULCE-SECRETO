import { createContext, useContext, useEffect, useState } from 'react'
import {
  iniciarSesionStaff,
  obtenerPerfilStaff,
  guardarTokenStaff,
  borrarTokenStaff,
  obtenerTokenStaff
} from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!obtenerTokenStaff()) {
      setCargando(false)
      return
    }

    obtenerPerfilStaff()
      .then(setUsuario)
      .catch(() => {
        // El token guardado ya no sirve (expiró o el usuario fue eliminado).
        borrarTokenStaff()
        setUsuario(null)
      })
      .finally(() => setCargando(false))
  }, [])

  async function iniciarSesion(email, password) {
    const { token, usuario: datosUsuario } = await iniciarSesionStaff(email, password)
    guardarTokenStaff(token)
    setUsuario(datosUsuario)
    return datosUsuario
  }

  function cerrarSesion() {
    borrarTokenStaff()
    setUsuario(null)
  }

  function actualizarUsuarioLocal(cambios) {
    setUsuario((actual) => (actual ? { ...actual, ...cambios } : actual))
  }

  return (
    <AuthContext.Provider
      value={{ usuario, cargando, iniciarSesion, cerrarSesion, actualizarUsuarioLocal }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return contexto
}
