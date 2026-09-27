import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth()
  const ubicacion = useLocation()

  if (cargando) {
    return <p className="contenedor py-24 text-center text-marron/50">Verificando sesión...</p>
  }

  if (!usuario) {
    return <Navigate to="/login" state={{ desde: ubicacion.pathname }} replace />
  }

  return children
}
