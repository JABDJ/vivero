import { supabase } from '../supabaseClient'

export default function ProductList({ products, fetchProducts, setEditing }) {
  const handleDelete = async (id) => {
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  return (
    <ul>
      {products.map(p => (
        <li key={p.id}>
          {p.name} - ${p.price} - Stock: {p.stock}
          <button onClick={() => setEditing(p)}>Editar</button>
          <button onClick={() => handleDelete(p.id)}>Eliminar</button>
        </li>
      ))}
    </ul>
  )
}