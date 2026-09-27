import { Link } from 'react-router-dom'

export default function Footer() {
  const anio = new Date().getFullYear()

  return (
    <footer id="contacto" className="border-t border-marron/10 bg-marron-oscuro text-crema-suave">
      {/* Contenedor Principal: 4 Columnas */}
      <div className="contenedor grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Columna 1: Marca, Identidad y Redes Sociales */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpg" 
              alt="Logo Dulce Secreto" 
              className="h-10 w-10 rounded-full object-cover border border-crema-suave/20 shadow-sm" 
            />
            <span className="font-display text-2xl italic tracking-wide text-crema-suave">
              Dulce Secreto
            </span>
          </div>
          <p className="max-w-xs text-sm text-crema-suave/75 leading-relaxed">
            Tortas y postres artesanales hechos por encargo, horneados el mismo día de tu entrega.
          </p>
          
          {/* Redes Sociales Integradas */}
          <div className="mt-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-crema-suave/60">
              Síguenos & Escríbenos
            </span>
            <div className="mt-3 flex items-center gap-3">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/dulcesecret26/" 
                target="_blank" 
                rel="noreferrer"
                aria-label="Instagram de Dulce Secreto"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-crema-suave transition-all hover:bg-rosa/80 hover:text-marron hover:scale-110"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a 
                href="https://facebook.com/DulceSecretoPasteleria" 
                target="_blank" 
                rel="noreferrer"
                aria-label="Facebook de Dulce Secreto"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-crema-suave transition-all hover:bg-rosa/80 hover:text-marron hover:scale-110"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a 
                href="https://wa.me/573105357830?text=¡Hola!%20Deseo%20cotizar%20un%20pedido%20especial%20en%20Dulce%20Secreto" 
                target="_blank" 
                rel="noreferrer"
                aria-label="WhatsApp Oficial"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-crema-suave transition-all hover:bg-emerald-500 hover:text-white hover:scale-110"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="text-xs text-crema-suave/60 space-y-1">
            <p>📍 Barranquilla, Colombia</p>
            <p>🧁 Cocina artesanal bajo encargo</p>
          </div>
        </div>

        {/* Columna 2: Catálogo y Productos */}
        <div>
          <h3 className="font-body text-sm font-semibold tracking-wider text-crema-suave uppercase">
            Repostería
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-crema-suave/75">
            <li>
              <Link to="/catalogo" className="hover:text-crema-suave transition-colors">
                Catálogo Completo
              </Link>
            </li>
            <li>
              <Link to="/personalizar" className="hover:text-crema-suave transition-colors">
                Tortas Personalizadas
              </Link>
            </li>
            <li>
              <Link to="/catalogo" className="hover:text-crema-suave transition-colors">
                Galletas Estilo NY
              </Link>
            </li>
            <li>
              <Link to="/catalogo" className="hover:text-crema-suave transition-colors">
                Postres Individuales
              </Link>
            </li>
            <li>
              <span className="text-crema-suave/40 text-xs">Experiencia "El Secreto VIP"</span>
            </li>
          </ul>
        </div>

        {/* Columna 3: Atención y Políticas */}
        <div>
          <h3 className="font-body text-sm font-semibold tracking-wider text-crema-suave uppercase">
            Atención y Políticas
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-crema-suave/75">
            <li>Martes a sábado: 9:00 a.m. – 6:00 p.m.</li>
            <li>Pedidos con 48 horas de anticipación</li>
            <li>Entrega a domicilio o retiro en local</li>
            <li>
              <a href="#terminos" className="hover:text-crema-suave transition-colors">
                Términos del Servicio
              </a>
            </li>
            <li>
              <a 
                href="https://wa.me/573105357830?text=Hola,%20deseo%20radicar%20una%20consulta%20o%20PQR%20sobre%20mi%20pedido" 
                target="_blank" 
                rel="noreferrer" 
                className="font-medium text-crema-suave underline decoration-rosa/50 hover:text-white"
              >
                Atención PQR y Reclamos (SIC)
              </a>
            </li>
          </ul>
        </div>

        {/* Columna 4: Contacto directo y Cuentas de Cliente */}
        <div>
          <h3 className="font-body text-sm font-semibold tracking-wider text-crema-suave uppercase">
            Contacto y Cuenta
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-crema-suave/75">
            <li>
              <a 
                href="https://wa.me/573105357830" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-crema-suave transition-colors"
              >
                WhatsApp: 310 5357830
              </a>
            </li>
            <li>
              <a href="mailto:hola@dulcesecreto.co" className="hover:text-crema-suave transition-colors">
                hola@dulcesecreto.co
              </a>
            </li>
            <li className="pt-1">
              <Link to="/cuenta/pedidos" className="hover:text-crema-suave transition-colors">
                Historial de Pedidos
              </Link>
            </li>
            <li>
              <Link to="/cuenta/perfil" className="hover:text-crema-suave transition-colors">
                Mi Perfil
              </Link>
            </li>
            <li className="pt-1">
              <span className="inline-block rounded-md bg-white/10 px-2 py-1 text-xs text-crema-suave/80">
                Pagos: Nequi · Bancolombia
              </span>
            </li>
          </ul>
        </div>

      </div>

      {/* Franja Inferior: Derechos, Vigilancia SIC y Acceso Administrativo */}
      <div className="border-t border-crema-suave/10 py-5">
        <div className="contenedor flex flex-wrap items-center justify-between gap-2 text-xs text-crema-suave/60">
          <span>© {anio} Dulce Secreto. Todos los derechos reservados. Barranquilla, Colombia.</span>
          <div className="flex items-center gap-3">
            <span>Vigilado SIC</span>
            <span>·</span>
            <Link to="/admin" className="underline decoration-crema-suave/30 underline-offset-2 hover:text-crema-suave">
              Acceso administrativo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}