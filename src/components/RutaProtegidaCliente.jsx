import { Navigate, useLocation } from 'react-router-dom'
import { useClienteAuth } from '../context/ClienteAuthContext.jsx'

export default function RutaProtegidaCliente({ children }) {
  const { cliente, cargando } = useClienteAuth()
  const ubicacion = useLocation()

  if (cargando) {
    return <p className="contenedor py-24 text-center text-marron/50">Verificando sesión...</p>
  }

  if (!cliente) {
    return <Navigate to="/cuenta/entrar" state={{ desde: ubicacion.pathname }} replace />
  }

  return children
}
