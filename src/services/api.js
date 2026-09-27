const BASE = '/api'

// Hay DOS sistemas de sesión totalmente separados, cada uno con su propia
// llave de almacenamiento: el panel de staff (Kelly/editores) y las cuentas
// de clientes (quien compra). Un token de uno nunca sirve para el otro.
const CLAVE_TOKEN_STAFF = 'ds_token_staff'
const CLAVE_TOKEN_CLIENTE = 'ds_token_cliente'

// --- Staff (panel administrativo) ---

export function obtenerTokenStaff() {
  return localStorage.getItem(CLAVE_TOKEN_STAFF)
}
export function guardarTokenStaff(token) {
  localStorage.setItem(CLAVE_TOKEN_STAFF, token)
}
export function borrarTokenStaff() {
  localStorage.removeItem(CLAVE_TOKEN_STAFF)
}
function encabezadosAuthStaff(extra = {}) {
  const token = obtenerTokenStaff()
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra
}

export async function iniciarSesionStaff(email, password) {
  const respuesta = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const datos = await respuesta.json()
  if (!respuesta.ok) throw new Error(datos.error || 'No se pudo iniciar sesión.')
  return datos
}

export async function obtenerPerfilStaff() {
  const respuesta = await fetch(`${BASE}/auth/perfil`, { headers: encabezadosAuthStaff() })
  const datos = await respuesta.json()
  if (!respuesta.ok) throw new Error(datos.error || 'No se pudo cargar el perfil.')
  return datos
}

export async function actualizarPerfilStaff(cambios) {
  const respuesta = await fetch(`${BASE}/auth/perfil`, {
    method: 'PATCH',
    headers: encabezadosAuthStaff({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(cambios)
  })
  const datos = await respuesta.json()
  if (!respuesta.ok) throw new Error(datos.error || 'No se pudo actualizar el perfil.')
  return datos
}

export async function obtenerUsuariosAdmin() {
  const respuesta = await fetch(`${BASE}/admin/usuarios`, { headers: encabezadosAuthStaff() })
  const datos = await respuesta.json()
  if (!respuesta.ok) throw new Error(datos.error || 'No se pudieron cargar los usuarios.')
  return datos
}

export async function crearUsuarioAdmin(datosUsuario) {
  const respuesta = await fetch(`${BASE}/admin/usuarios`, {
    method: 'POST',
    headers: encabezadosAuthStaff({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(datosUsuario)
  })
  const datos = await respuesta.json()
  if (!respuesta.ok) throw new Error(datos.error || 'No se pudo crear el usuario.')
  return datos
}

export async function eliminarUsuarioAdmin(id) {
  const respuesta = await fetch(`${BASE}/admin/usuarios/${id}`, {
    method: 'DELETE',
    headers: encabezadosAuthStaff()
  })
  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => ({}))
    throw new Error(datos.error || 'No se pudo eliminar el usuario.')
  }
}

export async function obtenerPedidosAdmin() {
  const respuesta = await fetch(`${BASE}/admin/pedidos`, { headers: encabezadosAuthStaff() })
  if (!respuesta.ok) throw new Error('No se pudieron cargar los pedidos.')
  return respuesta.json()
}

export async function actualizarEstadoPedido(id, cambios) {
  const respuesta = await fetch(`${BASE}/admin/pedidos/${id}/estado`, {
    method: 'PATCH',
    headers: encabezadosAuthStaff({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(cambios)
  })
  const datos = await respuesta.json()
  if (!respuesta.ok) throw new Error(datos.error || 'No se pudo actualizar el pedido.')
  return datos
}

// --- Clientes (cuenta del cliente que compra) ---

export function obtenerTokenCliente() {
  return localStorage.getItem(CLAVE_TOKEN_CLIENTE)
}
export function guardarTokenCliente(token) {
  localStorage.setItem(CLAVE_TOKEN_CLIENTE, token)
}
export function borrarTokenCliente() {
  localStorage.removeItem(CLAVE_TOKEN_CLIENTE)
}
function encabezadosAuthCliente(extra = {}) {
  const token = obtenerTokenCliente()
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra
}

export async function registrarCliente(datos) {
  const respuesta = await fetch(`${BASE}/clientes/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  const cuerpo = await respuesta.json()
  if (!respuesta.ok) throw new Error(cuerpo.error || 'No se pudo crear tu cuenta.')
  return cuerpo
}

export async function iniciarSesionCliente(email, password) {
  const respuesta = await fetch(`${BASE}/clientes/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const datos = await respuesta.json()
  if (!respuesta.ok) throw new Error(datos.error || 'No se pudo iniciar sesión.')
  return datos
}

export async function autenticarClienteConGoogle(credential) {
  const respuesta = await fetch(`${BASE}/clientes/auth-social`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential, proveedor: 'google' })
  })
  const datos = await respuesta.json()
  if (!respuesta.ok) throw new Error(datos.error || 'No se pudo iniciar sesión con Google.')
  return datos
}

export async function obtenerPerfilCliente() {
  const respuesta = await fetch(`${BASE}/clientes/perfil`, { headers: encabezadosAuthCliente() })
  const datos = await respuesta.json()
  if (!respuesta.ok) throw new Error(datos.error || 'No se pudo cargar tu perfil.')
  return datos
}

export async function actualizarPerfilCliente(cambios) {
  const respuesta = await fetch(`${BASE}/clientes/perfil`, {
    method: 'PATCH',
    headers: encabezadosAuthCliente({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(cambios)
  })
  const datos = await respuesta.json()
  if (!respuesta.ok) throw new Error(datos.error || 'No se pudo actualizar tu perfil.')
  return datos
}

export async function subirFotoPerfilCliente(archivo) {
  const formData = new FormData()
  formData.append('foto', archivo)
  const respuesta = await fetch(`${BASE}/clientes/perfil/foto`, {
    method: 'POST',
    headers: encabezadosAuthCliente(),
    body: formData
  })
  const datos = await respuesta.json()
  if (!respuesta.ok) throw new Error(datos.error || 'No se pudo subir tu foto.')
  return datos
}

export async function obtenerPedidosCliente() {
  const respuesta = await fetch(`${BASE}/clientes/pedidos`, { headers: encabezadosAuthCliente() })
  const datos = await respuesta.json()
  if (!respuesta.ok) throw new Error(datos.error || 'No se pudo cargar tu historial de pedidos.')
  return datos
}

// --- Catálogo (público) ---

export async function obtenerProductos() {
  const respuesta = await fetch(`${BASE}/productos`)
  if (!respuesta.ok) throw new Error('No se pudieron cargar los productos.')
  return respuesta.json()
}

export async function obtenerOpcionesPersonalizacion() {
  const respuesta = await fetch(`${BASE}/opciones-personalizacion`)
  if (!respuesta.ok) throw new Error('No se pudieron cargar las opciones de personalización.')
  return respuesta.json()
}

// crearPedido adjunta el token del cliente automáticamente SI hay sesión
// iniciada (para que el pedido quede en su historial), pero funciona igual
// sin sesión (compra como invitado).
export async function crearPedido(datosFormulario) {
  const respuesta = await fetch(`${BASE}/pedidos`, {
    method: 'POST',
    headers: encabezadosAuthCliente(),
    body: datosFormulario
  })
  const datos = await respuesta.json()
  if (!respuesta.ok) throw new Error(datos.error || 'No se pudo crear el pedido.')
  return datos
}
