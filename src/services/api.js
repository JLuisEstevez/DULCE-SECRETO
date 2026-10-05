// ==========================================
// MODO PORTAFOLIO (BACKEND SIMULADO)
// ==========================================

const CLAVE_TOKEN_STAFF = 'ds_token_staff'
const CLAVE_TOKEN_CLIENTE = 'ds_token_cliente'

// Simulador de retraso para que se vea la animación de carga en tu UI
const simularRetraso = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// --- Catálogo (público) ---

export async function obtenerProductos() {
  const respuesta = await fetch('/productos.json')
  if (!respuesta.ok) throw new Error('No se pudieron cargar los productos.')
  return respuesta.json()
}

export async function obtenerOpcionesPersonalizacion() {
  const respuesta = await fetch('/opciones.json')
  if (!respuesta.ok) throw new Error('No se pudieron cargar las opciones.')
  return respuesta.json()
}

// --- Clientes (Simulación) ---

export function obtenerTokenCliente() { return localStorage.getItem(CLAVE_TOKEN_CLIENTE) }
export function guardarTokenCliente(token) { localStorage.setItem(CLAVE_TOKEN_CLIENTE, token) }
export function borrarTokenCliente() { localStorage.removeItem(CLAVE_TOKEN_CLIENTE) }

export async function registrarCliente(datos) {
  await simularRetraso(1000)
  return { token: 'token-falso-cliente-123', usuario: datos }
}

export async function iniciarSesionCliente(email, password) {
  await simularRetraso(1000) 
  if (email && password) {
    return { token: 'token-falso-cliente-123', usuario: { nombre: 'Usuario de Prueba', email } }
  }
  throw new Error('Credenciales inválidas.')
}

export async function autenticarClienteConGoogle(credential) {
  await simularRetraso(1000)
  return { token: 'token-falso-cliente-123', usuario: { nombre: 'Usuario Google' } }
}

export async function obtenerPerfilCliente() {
  await simularRetraso(500)
  return { nombre: 'Usuario Portafolio', email: 'demo@portafolio.com' }
}

export async function actualizarPerfilCliente(cambios) {
  await simularRetraso(500)
  return { mensaje: 'Perfil actualizado con éxito (Demo)' }
}

export async function subirFotoPerfilCliente(archivo) {
  await simularRetraso(500)
  return { mensaje: 'Foto subida (Demo)' }
}

export async function obtenerPedidosCliente() {
  await simularRetraso(800)
  return [{
    id: 'DEMO-123',
    fecha_entrega: new Date().toISOString(),
    total: 85000,
    estado_pedido: 'En Preparación',
    producto_resumen: 'Torta de Vainilla Clásica'
  }]
}

// --- Pedidos (Simulación) ---

export async function crearPedido(datosFormulario) {
  await simularRetraso(1500) 
  return { mensaje: 'Pedido creado con éxito (Modo Demo)', id_pedido: 'DEMO-' + Math.floor(Math.random() * 1000) }
}

// --- Staff (Panel Administrativo Simulado) ---

export function obtenerTokenStaff() { return localStorage.getItem(CLAVE_TOKEN_STAFF) }
export function guardarTokenStaff(token) { localStorage.setItem(CLAVE_TOKEN_STAFF, token) }
export function borrarTokenStaff() { localStorage.removeItem(CLAVE_TOKEN_STAFF) }

export async function iniciarSesionStaff(email, password) {
  await simularRetraso(1000)
  if (email && password) {
    return { token: 'token-falso-staff-456', admin: { nombre: 'Kelly (Demo)', email } }
  }
  throw new Error('Credenciales inválidas.')
}

export async function obtenerPerfilStaff() {
  await simularRetraso(500)
  return { nombre: 'Kelly (Admin)', email: 'admin@dulcesecreto.com' }
}

export async function actualizarPerfilStaff(cambios) {
  await simularRetraso(500)
  return { mensaje: 'Perfil admin actualizado (Demo)' }
}

export async function obtenerUsuariosAdmin() {
  await simularRetraso(500)
  return [{ id: '1', nombre: 'Kelly Estévez', email: 'admin@dulcesecreto.com', rol: 'admin' }]
}

export async function crearUsuarioAdmin(datosUsuario) {
  await simularRetraso(500)
  return { mensaje: 'Usuario creado (Demo)' }
}

export async function eliminarUsuarioAdmin(id) {
  await simularRetraso(500)
  return { mensaje: 'Usuario eliminado (Demo)' }
}

export async function obtenerPedidosAdmin() {
  await simularRetraso(800)
  return [
    { id: '1', cliente_nombre: 'Laura Gómez', total: 205000, estado_pedido: 'Horneando' },
    { id: '2', cliente_nombre: 'Andrés Muñoz', total: 102000, estado_pedido: 'Por Validar' }
  ]
}

export async function actualizarEstadoPedido(id, cambios) {
  await simularRetraso(500)
  return { mensaje: 'Estado actualizado (Demo)' }
}