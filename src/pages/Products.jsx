import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import ProductForm from '../components/ProductForm'
import ProductList from '../components/ProductList'

export default function Products() {
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*')
    setProducts(data)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div>
      <h1>Gestión de Productos</h1>
      <ProductForm fetchProducts={fetchProducts} editing={editing} setEditing={setEditing} />
      <ProductList products={products} fetchProducts={fetchProducts} setEditing={setEditing} />
    </div>
  )
}