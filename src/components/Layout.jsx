import Header from './Header.jsx'
import Footer from './Footer.jsx'
import BotonWhatsapp from './BotonWhatsapp.jsx'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-crema-suave text-marron">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* Botón flotante persistente en toda la tienda */}
      <BotonWhatsapp />
    </div>
  )
}