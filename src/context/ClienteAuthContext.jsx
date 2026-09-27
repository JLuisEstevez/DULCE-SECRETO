import { createContext, useContext, useEffect, useState } from 'react'
import {
  iniciarSesionCliente as iniciarSesionApi,
  registrarCliente as registrarClienteApi,
  autenticarClienteConGoogle,
  obtenerPerfilCliente,
  guardarTokenCliente,
  borrarTokenCliente,
  obtenerTokenCliente
} from '../services/api.js'

const ClienteAuthContext = createContext(null)

export function ClienteAuthProvider({ children }) {
  const [cliente, setCliente] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!obtenerTokenCliente()) {
      setCargando(false)
      return
    }

    obtenerPerfilCliente()
      .then(setCliente)
      .catch(() => {
        borrarTokenCliente()
        setCliente(null)
      })
      .finally(() => setCargando(false))
  }, [])

  async function iniciarSesion(email, password) {
    const { token, cliente: datosCliente } = await iniciarSesionApi(email, password)
    guardarTokenCliente(token)
    setCliente(datosCliente)
    return datosCliente
  }

  async function registrarse(datos) {
    const { token, cliente: datosCliente } = await registrarClienteApi(datos)
    guardarTokenCliente(token)
    setCliente(datosCliente)
    return datosCliente
  }

  async function iniciarSesionConGoogle(credential) {
    const { token, cliente: datosCliente } = await autenticarClienteConGoogle(credential)
    guardarTokenCliente(token)
    setCliente(datosCliente)
    return datosCliente
  }

  function cerrarSesion() {
    borrarTokenCliente()
    setCliente(null)
  }

  function actualizarClienteLocal(cambios) {
    setCliente((actual) => (actual ? { ...actual, ...cambios } : actual))
  }

  return (
    <ClienteAuthContext.Provider
      value={{
        cliente,
        cargando,
        iniciarSesion,
        registrarse,
        iniciarSesionConGoogle,
        cerrarSesion,
        actualizarClienteLocal
      }}
    >
      {children}
    </ClienteAuthContext.Provider>
  )
}

export function useClienteAuth() {
  const contexto = useContext(ClienteAuthContext)
  if (!contexto) throw new Error('useClienteAuth debe usarse dentro de <ClienteAuthProvider>')
  return contexto
}
