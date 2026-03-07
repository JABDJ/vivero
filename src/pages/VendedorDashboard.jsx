import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/format'

export default function VendedorDashboard() {
    const { logout, user } = useAuth()
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState('')

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('creado_en', { ascending: false })
        if (!error) setProducts(data || [])
    }

    useEffect(() => { fetchProducts() }, [])

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    const filtered = products.filter(p =>
        p.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        p.categoria?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex h-screen w-full bg-background text-white overflow-hidden font-sans">

            {/* SIDEBAR */}
            <aside className="w-64 bg-background border-r border-gray-800 hidden md:flex flex-col z-20">
                <div className="p-6 flex items-center gap-3 border-b border-gray-800">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/50">V</div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-wide text-white">JABDJ</span>
                        <span className="text-xs text-emerald-400 font-medium">Vendedor</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
                    {/* Productos — activo */}
                    <Link to="/vendedor" className="flex items-center gap-3 px-3 py-2.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-lg shadow-lg transition-transform active:scale-95">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span className="text-sm font-medium">Productos</span>
                    </Link>

                    {/* Facturas */}
                    <Link to="/facturas" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-surface hover:text-white rounded-lg transition-colors group">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-medium">Nueva Factura</span>
                    </Link>

                    {/* Historial */}
                    <Link to="/historial" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-surface hover:text-white rounded-lg transition-colors group">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">Historial</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-800 space-y-2">
                    <div className="px-3 py-2 text-xs text-gray-500 truncate">{user?.email}</div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 px-4 py-2 w-full transition-colors rounded-lg hover:bg-red-500/10">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
                <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-emerald-600/8 rounded-full blur-[128px] pointer-events-none" />

                <header className="flex justify-between items-center p-8 z-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Catálogo de Productos</h1>
                        <p className="text-gray-400 text-sm mt-1">Vista de consulta — solo lectura</p>
                    </div>
                    {/* Buscador */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2.5 bg-gray-800/60 border border-gray-700 text-white text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-56"
                        />
                    </div>
                </header>

                <div className="flex-1 overflow-auto px-8 pb-8 z-10">
                    <div className="bg-surface/50 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                        {filtered.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                {search ? 'No se encontraron productos.' : 'No hay productos registrados.'}
                            </div>
                        ) : (
                            <table className="table w-full text-left">
                                <thead className="bg-surface text-gray-400 font-medium uppercase text-xs tracking-wider border-b border-gray-700">
                                    <tr>
                                        <th className="py-4 pl-6">Imagen</th>
                                        <th>Producto</th>
                                        <th>Categoría</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-300 divide-y divide-gray-700/50">
                                    {filtered.map((p) => (
                                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                            {/* Imagen */}
                                            <td className="py-3 pl-6">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden ring-1 ring-white/10 bg-gray-700 flex items-center justify-center">
                                                    {p.imagen_url ? (
                                                        <img
                                                            src={p.imagen_url}
                                                            alt={p.nombre}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null
                                                                e.target.style.display = 'none'
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-gray-500">IMG</span>
                                                    )}
                                                </div>
                                            </td>
                                            {/* Nombre */}
                                            <td>
                                                <div className="font-semibold text-white">{p.nombre}</div>
                                                {p.descripcion && (
                                                    <div className="text-xs text-gray-500 truncate max-w-[180px]">{p.descripcion}</div>
                                                )}
                                            </td>
                                            {/* Categoría */}
                                            <td>
                                                <span className="badge bg-gray-700/50 text-gray-300 border-none text-xs px-3 py-1">
                                                    {p.categoria ?? '—'}
                                                </span>
                                            </td>
                                            {/* Precio */}
                                            <td>
                                                <span className="text-emerald-400 font-semibold font-mono">
                                                    ${formatPrice(p.precio ?? 0)}
                                                </span>
                                            </td>
                                            {/* Stock */}
                                            <td>
                                                <span className={`font-semibold ${p.stock > 10 ? 'text-green-400' : p.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                    {p.stock ?? 0}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
