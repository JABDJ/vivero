import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import InicioUsuario from './pages/InicioUsuario'
import GestionUsuarios from './pages/GestionUsuarios'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />

        {/* Solo admin */}
        <Route path="/dashboard" element={
          <PrivateRoute allowedRoles={['admin']}>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/products" element={
          <PrivateRoute allowedRoles={['admin']}>
            <Products />
          </PrivateRoute>
        } />
        <Route path="/usuarios" element={
          <PrivateRoute allowedRoles={['admin']}>
            <GestionUsuarios />
          </PrivateRoute>
        } />

        {/* Solo user */}
        <Route path="/inicio" element={
          <PrivateRoute allowedRoles={['user']}>
            <InicioUsuario />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}