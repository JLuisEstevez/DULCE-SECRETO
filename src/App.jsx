import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ClienteAuthProvider } from './context/ClienteAuthContext.jsx'
import RutaProtegida from './components/RutaProtegida.jsx'
import RutaProtegidaCliente from './components/RutaProtegidaCliente.jsx'
import Layout from './components/Layout.jsx'
import Inicio from './pages/Inicio.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Personalizador from './pages/Personalizador.jsx'
import Checkout from './pages/Checkout.jsx'
import Login from './pages/Login.jsx'
import Admin from './pages/Admin.jsx'
import Perfil from './pages/Perfil.jsx'
import GestionUsuarios from './pages/GestionUsuarios.jsx'
import LoginCliente from './pages/LoginCliente.jsx'
import RegistroCliente from './pages/RegistroCliente.jsx'
import PerfilCliente from './pages/PerfilCliente.jsx'
import MisPedidos from './pages/MisPedidos.jsx'

export default function App() {
  return (
    <AuthProvider>
      <ClienteAuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/personalizar" element={<Personalizador />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* Cuenta de CLIENTE (quien compra) */}
            <Route path="/cuenta/entrar" element={<LoginCliente />} />
            <Route path="/cuenta/crear" element={<RegistroCliente />} />
            <Route
              path="/cuenta/perfil"
              element={
                <RutaProtegidaCliente>
                  <PerfilCliente />
                </RutaProtegidaCliente>
              }
            />
            <Route
              path="/cuenta/pedidos"
              element={
                <RutaProtegidaCliente>
                  <MisPedidos />
                </RutaProtegidaCliente>
              }
            />

            {/* Panel de STAFF (Kelly / editores) */}
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <RutaProtegida>
                  <Admin />
                </RutaProtegida>
              }
            />
            <Route
              path="/admin/perfil"
              element={
                <RutaProtegida>
                  <Perfil />
                </RutaProtegida>
              }
            />
            <Route
              path="/admin/usuarios"
              element={
                <RutaProtegida>
                  <GestionUsuarios />
                </RutaProtegida>
              }
            />
          </Routes>
        </Layout>
      </ClienteAuthProvider>
    </AuthProvider>
  )
}




