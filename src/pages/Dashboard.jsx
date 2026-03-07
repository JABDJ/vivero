import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import ProductList from '../components/ProductList'
import ProductForm from '../components/ProductForm'
import AdminSidebar from '../components/AdminSidebar'

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

      <AdminSidebar />

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