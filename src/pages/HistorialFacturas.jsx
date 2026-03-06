import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function HistorialFacturas() {
    const { logout, user } = useAuth()
    const navigate = useNavigate()
    const [facturas, setFacturas] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedId, setExpandedId] = useState(null)   // ID de factura expandida
    const [itemsMap, setItemsMap] = useState({})          // { [factura_id]: [...items] }
    const [loadingItems, setLoadingItems] = useState(false)
    const [search, setSearch] = useState('')

    const fetchFacturas = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('facturas')
            .select('*')
            .order('creado_en', { ascending: false })
        setFacturas(data || [])
        setLoading(false)
    }

    useEffect(() => { fetchFacturas() }, [])

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    const toggleExpand = async (facturaId) => {
        // Si ya está abierta, la cerramos
        if (expandedId === facturaId) {
            setExpandedId(null)
            return
        }
        setExpandedId(facturaId)
        // Si ya cargamos los ítems, no los pedimos de nuevo
        if (itemsMap[facturaId]) return

        setLoadingItems(true)
        const { data } = await supabase
            .from('factura_items')
            .select('*')
            .eq('factura_id', facturaId)
        setItemsMap(prev => ({ ...prev, [facturaId]: data || [] }))
        setLoadingItems(false)
    }

    const filteredFacturas = facturas.filter(f =>
        f.cliente_nombre?.toLowerCase().includes(search.toLowerCase()) ||
        f.vendedor_email?.toLowerCase().includes(search.toLowerCase())
    )

    const formatFecha = (isoString) => {
        if (!isoString) return '—'
        return new Date(isoString).toLocaleString('es-VE', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
    }

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
                    <Link to="/vendedor" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-surface hover:text-white rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span className="text-sm font-medium">Productos</span>
                    </Link>

                    <Link to="/facturas" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-surface hover:text-white rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-medium">Nueva Factura</span>
                    </Link>

                    {/* Historial — activo */}
                    <Link to="/historial" className="flex items-center gap-3 px-3 py-2.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-lg shadow-lg">
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

            {/* CONTENIDO */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
                <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-emerald-600/8 rounded-full blur-[128px] pointer-events-none" />

                <header className="flex justify-between items-center p-8 z-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Historial de Facturas</h1>
                        <p className="text-gray-400 text-sm mt-1">{facturas.length} factura{facturas.length !== 1 ? 's' : ''} guardada{facturas.length !== 1 ? 's' : ''}</p>
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
                            placeholder="Buscar cliente..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2.5 bg-gray-800/60 border border-gray-700 text-white text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-56"
                        />
                    </div>
                </header>

                <div className="flex-1 overflow-auto px-8 pb-8 z-10 space-y-3">
                    {loading ? (
                        <div className="flex items-center justify-center h-48 text-gray-500">Cargando facturas...</div>
                    ) : filteredFacturas.length === 0 ? (
                        <div className="flex items-center justify-center h-48 text-gray-500">
                            {search ? 'No se encontraron facturas.' : 'Aún no hay facturas registradas.'}
                        </div>
                    ) : (
                        filteredFacturas.map((f) => (
                            <div
                                key={f.id}
                                className="bg-surface/50 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-lg"
                            >
                                {/* Fila de resumen — clickeable */}
                                <button
                                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors text-left"
                                    onClick={() => toggleExpand(f.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Icono */}
                                        <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">{f.cliente_nombre}</p>
                                            <p className="text-gray-500 text-xs">{formatFecha(f.creado_en)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <span className="text-emerald-400 font-extrabold text-lg font-mono">
                                            ${Number(f.total).toFixed(2)}
                                        </span>
                                        {/* Chevron animado */}
                                        <svg
                                            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${expandedId === f.id ? 'rotate-180' : ''}`}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>

                                {/* Detalle expandible */}
                                {expandedId === f.id && (
                                    <div className="border-t border-gray-700/50 px-6 py-4 bg-black/20">
                                        {loadingItems && !itemsMap[f.id] ? (
                                            <p className="text-gray-500 text-sm">Cargando ítems...</p>
                                        ) : (itemsMap[f.id] || []).length === 0 ? (
                                            <p className="text-gray-500 text-sm">No se encontraron ítems.</p>
                                        ) : (
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="text-gray-500 text-xs uppercase tracking-wider">
                                                        <th className="text-left pb-2">Producto</th>
                                                        <th className="text-center pb-2">Cant.</th>
                                                        <th className="text-right pb-2">Precio Unit.</th>
                                                        <th className="text-right pb-2">Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-700/30">
                                                    {(itemsMap[f.id] || []).map((item) => (
                                                        <tr key={item.id}>
                                                            <td className="py-2 text-white font-medium">{item.nombre_producto}</td>
                                                            <td className="py-2 text-center text-gray-400">{item.cantidad}</td>
                                                            <td className="py-2 text-right text-gray-400 font-mono">${Number(item.precio_unitario).toFixed(2)}</td>
                                                            <td className="py-2 text-right text-emerald-400 font-bold font-mono">${Number(item.subtotal).toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="border-t border-gray-600">
                                                        <td colSpan={3} className="pt-3 text-right text-gray-400 font-medium text-sm">Total</td>
                                                        <td className="pt-3 text-right text-emerald-400 font-extrabold text-base font-mono">${Number(f.total).toFixed(2)}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    )
}
