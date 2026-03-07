import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/format'

export default function Facturas() {
    const { logout, user } = useAuth()
    const navigate = useNavigate()

    const [products, setProducts] = useState([])
    const [clienteNombre, setClienteNombre] = useState('')
    const [items, setItems] = useState([])
    // selectedProductId se guarda como STRING (valor del <select>)
    const [selectedProductId, setSelectedProductId] = useState('')
    const [cantidad, setCantidad] = useState(1)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase.from('products').select('*').order('nombre')
            setProducts(data || [])
        }
        fetchProducts()
    }, [])

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    // CORRECCIÓN: comparar con == (no ===) para manejar bigint vs string
    const selectedProduct = products.find(p => String(p.id) === String(selectedProductId))

    const handleAddItem = () => {
        if (!selectedProduct || Number(cantidad) < 1) return

        // Validar que no supere el stock disponible
        const cantidadNum = Number(cantidad)
        const yaEnCarrito = items.find(i => String(i.product.id) === String(selectedProduct.id))
        const cantidadYaAgregada = yaEnCarrito ? yaEnCarrito.cantidad : 0
        if (cantidadNum + cantidadYaAgregada > selectedProduct.stock) {
            setError(`Stock insuficiente. Solo hay ${selectedProduct.stock} unidades disponibles (ya tienes ${cantidadYaAgregada} en la factura).`)
            return
        }
        setError(null)

        const exists = items.findIndex(i => String(i.product.id) === String(selectedProduct.id))
        if (exists >= 0) {
            const updated = [...items]
            updated[exists].cantidad += cantidadNum
            setItems(updated)
        } else {
            setItems([...items, { product: selectedProduct, cantidad: cantidadNum }])
        }
        setSelectedProductId('')
        setCantidad(1)
    }

    // Editar cantidad directamente en el resumen
    const handleChangeItemCantidad = (idx, newCant) => {
        const val = Number(newCant)
        if (val < 1) return
        const item = items[idx]
        if (val > item.product.stock) {
            setError(`Stock insuficiente para "${item.product.nombre}". Max: ${item.product.stock}`)
            return
        }
        setError(null)
        const updated = [...items]
        updated[idx] = { ...updated[idx], cantidad: val }
        setItems(updated)
    }

    const total = items.reduce((acc, i) => acc + i.product.precio * i.cantidad, 0)

    const handleGuardar = async () => {
        if (!clienteNombre.trim()) { setError('Por favor ingresa el nombre del cliente.'); return }
        if (items.length === 0) { setError('Agrega al menos un producto.'); return }
        setError(null)
        setSaving(true)
        try {
            // 1. Insertar factura
            const { data: factura, error: facturaError } = await supabase
                .from('facturas')
                .insert({ vendedor_email: user.email, cliente_nombre: clienteNombre.trim(), total })
                .select()
                .single()
            if (facturaError) throw facturaError

            // 2. Insertar ítems
            const itemsToInsert = items.map(i => ({
                factura_id: factura.id,
                product_id: i.product.id,
                nombre_producto: i.product.nombre,
                cantidad: i.cantidad,
                precio_unitario: i.product.precio,
                subtotal: i.product.precio * i.cantidad,
            }))
            const { error: itemsError } = await supabase.from('factura_items').insert(itemsToInsert)
            if (itemsError) throw itemsError

            // 3. Restar stock de cada producto
            for (const item of items) {
                const nuevoStock = item.product.stock - item.cantidad
                await supabase
                    .from('products')
                    .update({ stock: nuevoStock >= 0 ? nuevoStock : 0 })
                    .eq('id', item.product.id)
            }

            setSuccess(true)
            setTimeout(() => {
                setSuccess(false)
                setClienteNombre('')
                setItems([])
            }, 2500)
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
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

                    {/* Facturas — activo */}
                    <Link to="/facturas" className="flex items-center gap-3 px-3 py-2.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-lg shadow-lg">
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

                <header className="flex items-center p-8 z-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Nueva Factura</h1>
                        <p className="text-gray-400 text-sm mt-1">Selecciona productos y guarda la venta</p>
                    </div>
                </header>

                <div className="flex-1 overflow-auto px-8 pb-8 z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Panel izquierdo: datos y agregar producto */}
                        <div className="space-y-5">

                            {/* Nombre del cliente */}
                            <div className="bg-surface/50 backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-2xl">
                                <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Nombre del Cliente</label>
                                <input
                                    type="text"
                                    placeholder="Ej. Juan Pérez"
                                    value={clienteNombre}
                                    onChange={(e) => setClienteNombre(e.target.value)}
                                    className="w-full bg-gray-800/60 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            {/* Agregar producto */}
                            <div className="bg-surface/50 backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-2xl space-y-4">
                                <h2 className="text-sm font-semibold text-white">Agregar Producto</h2>

                                {/* Select con imagen en la vista previa */}
                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Producto</label>
                                    <select
                                        value={selectedProductId}
                                        onChange={(e) => setSelectedProductId(e.target.value)}
                                        className="w-full bg-gray-800/60 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">— Seleccionar producto —</option>
                                        {products.map(p => (
                                            <option key={p.id} value={String(p.id)}>
                                                {p.nombre} — ${formatPrice(p.precio)} (Stock: {p.stock})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Preview imagen del producto seleccionado */}
                                {selectedProduct && selectedProduct.imagen_url && (
                                    <div className="flex items-center gap-3 bg-gray-800/40 rounded-xl p-3">
                                        <img
                                            src={selectedProduct.imagen_url}
                                            alt={selectedProduct.nombre}
                                            className="w-12 h-12 rounded-lg object-cover ring-1 ring-emerald-500/30"
                                            onError={(e) => { e.target.style.display = 'none' }}
                                        />
                                        <div>
                                            <p className="text-white text-sm font-medium">{selectedProduct.nombre}</p>
                                            <p className="text-gray-400 text-xs">{selectedProduct.categoria}</p>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Cantidad</label>
                                    <input
                                        type="number" min={1}
                                        value={cantidad}
                                        onChange={(e) => setCantidad(e.target.value)}
                                        className="w-full bg-gray-800/60 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                {selectedProduct && (
                                    <div className="text-xs text-gray-400 bg-gray-800/40 rounded-lg px-3 py-2">
                                        Subtotal: <span className="text-emerald-400 font-bold">${(selectedProduct.precio * cantidad).toFixed(2)}</span>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={handleAddItem}
                                    disabled={!selectedProductId}
                                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold disabled:opacity-40 transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    + Agregar a la Factura
                                </button>
                            </div>
                        </div>

                        {/* Panel derecho: resumen de factura */}
                        <div className="bg-surface/50 backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-2xl flex flex-col">
                            <h2 className="text-sm font-semibold text-white mb-4">Resumen de Factura</h2>

                            {items.length === 0 ? (
                                <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
                                    Aún no hay productos agregados.
                                </div>
                            ) : (
                                <div className="flex-1 overflow-auto space-y-2">
                                    {items.map((item, idx) => (
                                        <div key={idx} className="bg-gray-800/40 rounded-xl px-4 py-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {item.product.imagen_url && (
                                                        <img
                                                            src={item.product.imagen_url}
                                                            alt={item.product.nombre}
                                                            className="w-9 h-9 rounded-lg object-cover ring-1 ring-white/10"
                                                            onError={(e) => { e.target.style.display = 'none' }}
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="text-white text-sm font-medium">{item.product.nombre}</p>
                                                        <p className="text-gray-500 text-xs">Stock: {item.product.stock} | ${formatPrice(item.product.precio)} c/u</p>
                                                    </div>
                                                </div>
                                                {/* Botón eliminar */}
                                                <button
                                                    onClick={() => setItems(items.filter((_, i) => i !== idx))}
                                                    className="text-red-400 hover:text-red-300 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                            {/* Controles de cantidad */}
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleChangeItemCantidad(idx, item.cantidad - 1)}
                                                        disabled={item.cantidad <= 1}
                                                        className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold disabled:opacity-30 transition-all flex items-center justify-center text-lg"
                                                    >−</button>
                                                    <input
                                                        type="number" min={1} max={item.product.stock}
                                                        value={item.cantidad}
                                                        onChange={(e) => handleChangeItemCantidad(idx, e.target.value)}
                                                        className="w-12 text-center bg-gray-900 border border-gray-600 text-white rounded-lg py-1 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                    />
                                                    <button
                                                        onClick={() => handleChangeItemCantidad(idx, item.cantidad + 1)}
                                                        disabled={item.cantidad >= item.product.stock}
                                                        className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold disabled:opacity-30 transition-all flex items-center justify-center text-lg"
                                                    >+</button>
                                                </div>
                                                <span className="text-emerald-400 font-bold text-sm">
                                                    ${formatPrice(item.product.precio * item.cantidad)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Total */}
                            <div className="border-t border-gray-700 mt-4 pt-4 flex justify-between items-center">
                                <span className="text-gray-400 font-medium">Total</span>
                                <span className="text-2xl font-extrabold text-emerald-400">${formatPrice(total)}</span>
                            </div>

                            {/* Mensajes */}
                            {error && (
                                <p className="mt-3 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                                    ❌ {error}
                                </p>
                            )}
                            {success && (
                                <p className="mt-3 text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
                                    ✅ Factura guardada exitosamente
                                </p>
                            )}

                            {/* Botón guardar */}
                            <button
                                onClick={handleGuardar}
                                disabled={saving || items.length === 0}
                                className="mt-4 w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold disabled:opacity-40 transition-all shadow-lg shadow-emerald-500/30 text-sm"
                            >
                                {saving ? 'Guardando...' : '💾 Guardar Factura'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
