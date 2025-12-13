import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import ProductList from '../components/ProductList'
import ProductForm from '../components/ProductForm'

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const navigate = useNavigate()

 // Dentro de src/pages/Dashboard.jsx

const fetchProducts = async () => {
    // CORRECCIÓN: Usar 'creado_en' en lugar de 'created_at'
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('creado_en', { ascending: false })
      
    if (error) console.error("Error cargando productos:", error.message)
    else setProducts(data || [])
}

  useEffect(() => { fetchProducts() }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }
  
  return (
    // Usamos 'flex' y 'h-screen' para que ocupe toda la pantalla y no se vea negro/vacío
    <div className="flex h-screen w-full bg-background text-white overflow-hidden font-sans">
      
      {/* SIDEBAR - Izquierda */}
      <aside className="w-64 bg-background border-r border-gray-800 hidden md:flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/50">A</div>
          <span className="text-xl font-bold tracking-wide">ADMIN PANEL</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-4 mt-6">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Menú Principal</div>
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl shadow-lg shadow-blue-900/40 transition-transform active:scale-95">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            Inventario
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-surface hover:text-white rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
            Apariencia
          </a>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 px-4 py-2 w-full transition-colors rounded-lg hover:bg-red-500/10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL - Derecha */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
        {/* Efecto de luz de fondo (Glow) */}
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] pointer-events-none"></div>

        <header className="flex justify-between items-center p-8 z-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Gestión de Productos</h1>
            <p className="text-gray-400 text-sm mt-1">Administra tu catálogo e inventario</p>
          </div>
          <button 
            onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
            className="btn bg-primary hover:bg-blue-600 text-white border-none px-6 rounded-lg shadow-lg shadow-blue-500/30"
          >
            + Nuevo Producto
          </button>
        </header>

        <div className="flex-1 overflow-auto px-8 pb-8 z-10">
          <div className="bg-surface/50 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
             <ProductList 
               products={products} 
               fetchProducts={fetchProducts} 
               setEditing={(prod) => { setEditingProduct(prod); setIsModalOpen(true); }} 
             />
          </div>
        </div>
      </main>

      {/* MODAL (Pantalla superpuesta) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <ProductForm 
            fetchProducts={fetchProducts} 
            editing={editingProduct} 
            setEditing={setEditingProduct}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </div>
  )
}