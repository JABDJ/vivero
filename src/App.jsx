import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import InicioUsuario from './pages/InicioUsuario'
import GestionUsuarios from './pages/GestionUsuarios'
import VendedorDashboard from './pages/VendedorDashboard'
import Facturas from './pages/Facturas'
import HistorialFacturas from './pages/HistorialFacturas'
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

        {/* Solo vendedor */}
        <Route path="/vendedor" element={
          <PrivateRoute allowedRoles={['vendedor']}>
            <VendedorDashboard />
          </PrivateRoute>
        } />
        <Route path="/facturas" element={
          <PrivateRoute allowedRoles={['vendedor']}>
            <Facturas />
          </PrivateRoute>
        } />
        <Route path="/historial" element={
          <PrivateRoute allowedRoles={['vendedor', 'admin']}>
            <HistorialFacturas />
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