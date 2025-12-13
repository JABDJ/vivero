import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import ProductForm from '../components/ProductForm'
import ProductList from '../components/ProductList'

export default function Products() {
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const navigate = useNavigate()

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: true })
    setProducts(data)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-base-content">Gestión de Productos</h1>
          <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
            Volver al Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna Izquierda: Formulario */}
          <div className="md:col-span-1">
            <div className="card bg-base-100 shadow-xl sticky top-8">
              <div className="card-body">
                <h2 className="card-title text-lg">
                  {editing ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <ProductForm 
                  fetchProducts={fetchProducts} 
                  editing={editing} 
                  setEditing={setEditing} 
                />
              </div>
            </div>
          </div>

          {/* Columna Derecha: Lista */}
          <div className="md:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body overflow-x-auto">
                <ProductList 
                  products={products} 
                  fetchProducts={fetchProducts} 
                  setEditing={setEditing} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}