import { OAuth2Client } from 'google-auth-library'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const cliente = new OAuth2Client(GOOGLE_CLIENT_ID)

// Verifica el "credential" (JWT) que entrega Google Identity Services en el
// navegador. NUNCA confiamos en el correo/nombre que mande el frontend por su
// cuenta: la única fuente de verdad es lo que Google firma dentro del token,
// verificado aquí contra los servidores de Google.
//
// Devuelve { email, nombre, googleId } o lanza un error si el token no es válido.
export async function verificarTokenGoogle(credential) {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error(
      'El servidor no tiene configurado GOOGLE_CLIENT_ID. Pídele a quien administra el proyecto que lo agregue en server/.env.'
    )
  }
  if (!credential) {
    throw new Error('Falta el token de Google.')
  }

  let ticket
  try {
    ticket = await cliente.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID })
  } catch {
    throw new Error('No se pudo verificar tu cuenta de Google. Intenta de nuevo.')
  }

  const payload = ticket.getPayload()
  if (!payload?.email) {
    throw new Error('Tu cuenta de Google no tiene un correo verificable.')
  }
  if (!payload.email_verified) {
    throw new Error('Tu correo de Google no está verificado.')
  }

  return {
    email: payload.email.toLowerCase(),
    nombre: payload.name || [payload.given_name, payload.family_name].filter(Boolean).join(' ') || payload.email,
    googleId: payload.sub
  }
}
