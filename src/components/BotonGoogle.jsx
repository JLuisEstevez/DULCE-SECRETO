import { useEffect, useRef, useState } from 'react'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

// Renderiza el botón OFICIAL de Google (fondo blanco, borde, logo de Google)
// usando la librería "Google Identity Services". Cuando la persona elige su
// cuenta, Google llama a onCredential(credential) con un JWT firmado por
// Google; ese token es lo único que mandamos al backend para verificar quién
// es (nunca leemos el nombre/correo desde el frontend).
export default function BotonGoogle({ onCredential, texto = 'continue_with' }) {
  const contenedorRef = useRef(null)
  const [listo, setListo] = useState(false)

  useEffect(() => {
    if (!CLIENT_ID) return

    function inicializar() {
      if (!window.google?.accounts?.id || !contenedorRef.current) return

      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (respuesta) => onCredential(respuesta.credential)
      })

      window.google.accounts.id.renderButton(contenedorRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: texto,
        shape: 'pill',
        width: 320
      })

      setListo(true)
    }

    if (window.google?.accounts?.id) {
      inicializar()
    } else {
      // El script de Google (cargado en index.html) puede tardar un momento en
      // estar disponible; reintentamos hasta que exista.
      const intervalo = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(intervalo)
          inicializar()
        }
      }, 200)
      return () => clearInterval(intervalo)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!CLIENT_ID) return null // login social no configurado: no mostramos un botón roto

  return (
    <div className="flex justify-center">
      <div ref={contenedorRef} />
      {!listo && <span className="text-xs text-marron/50">Cargando Google...</span>}
    </div>
  )
}
