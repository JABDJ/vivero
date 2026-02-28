import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function InicioUsuario() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    return (
        <div className="flex min-h-screen w-full bg-[#0f172a] items-center justify-center">
            <div className="text-center text-white space-y-6 p-8">
                {/* Icono */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>

                {/* Bienvenida */}
                <div>
                    <h1 className="text-3xl font-bold">¡Bienvenido!</h1>
                    <p className="text-gray-400 mt-2 text-sm">{user?.email}</p>
                </div>

                <p className="text-gray-400 max-w-sm mx-auto">
                    Esta es tu área personal. Pronto podrás ver el catálogo de productos y tus pedidos aquí.
                </p>

                {/* Botón cerrar sesión */}
                <button
                    onClick={handleLogout}
                    className="mt-4 flex items-center gap-2 mx-auto text-sm text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400/50 px-5 py-2.5 rounded-xl transition-all"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    )
}
