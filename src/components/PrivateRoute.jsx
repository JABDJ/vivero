import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Spinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#0f172a]">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
)

// allowedRoles: array de roles permitidos, ej. ['admin'] o ['user']
export default function PrivateRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth()

  // Esperando sesión inicial
  if (loading) return <Spinner />

  // Sin sesión → al login
  if (!user) return <Navigate to="/" replace />

  // Usuario autenticado pero el rol todavía se está cargando en background
  if (user && role === null) return <Spinner />

  // Rol no permitido → redirigir a su ruta correcta
  if (allowedRoles && !allowedRoles.includes(role)) {
    const fallback = role === 'admin' ? '/dashboard' : '/inicio'
    return <Navigate to={fallback} replace />
  }

  return children
}