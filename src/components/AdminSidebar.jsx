import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminSidebar() {
    const { logout, user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    // Helper para resaltar el item activo
    const active = (path) =>
        location.pathname === path
            ? 'bg-primary text-white shadow-lg shadow-blue-900/40'
            : 'text-gray-400 hover:bg-surface hover:text-white'

    return (
        <aside className="w-64 bg-background border-r border-gray-800 hidden md:flex flex-col z-20">
            {/* Header */}
            <div className="p-6 flex items-center gap-3 border-b border-gray-800">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/50">J</div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-wide text-white">JABDJ</span>
                    <span className="text-xs text-gray-500">&amp; ArSistema</span>
                </div>
            </div>

            {/* Selector Sucursal */}
            <div className="px-4 pt-4 pb-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sucursal</div>
                <div className="bg-surface border border-gray-700 rounded-lg px-3 py-2 flex items-center justify-between cursor-pointer hover:border-primary transition-colors">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-sm text-white">JABDJ</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
                {/* Resumen */}
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-surface hover:text-white rounded-lg transition-colors group">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-sm font-medium">Resumen</span>
                </a>

                {/* Inventario */}
                <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active('/dashboard')}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="text-sm font-medium">Inventario</span>
                </Link>

                {/* Usuarios */}
                <Link to="/usuarios" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active('/usuarios')}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium">Usuarios</span>
                </Link>

                {/* Servicios */}
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-surface hover:text-white rounded-lg transition-colors group">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">Servicios</span>
                    <svg className="w-4 h-4 ml-auto text-gray-600 group-hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </a>

                {/* Facturas */}
                <Link to="/historial" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active('/historial')}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium">Facturas</span>
                </Link>

                {/* Caja */}
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-surface hover:text-white rounded-lg transition-colors group">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm font-medium">Caja</span>
                </a>

                {/* Remitos */}
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-surface hover:text-white rounded-lg transition-colors group">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium">Remitos</span>
                </a>

                {/* Dashboard */}
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-surface hover:text-white rounded-lg transition-colors group">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 12a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
                    </svg>
                    <span className="text-sm font-medium">Dashboard</span>
                </a>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800">
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 px-4 py-2 w-full transition-colors rounded-lg hover:bg-red-500/10">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    )
}
