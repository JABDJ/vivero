import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function ProductForm({ fetchProducts, editing, setEditing }) {
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '' })

  useEffect(() => {
    if (editing) setForm(editing)
    else setForm({ name: '', description: '', price: '', stock: '' })
  }, [editing])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      await supabase.from('products').update(form).eq('id', editing.id)
    } else {
      await supabase.from('products').insert([form])
    }
    setEditing(null)
    fetchProducts()
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Descripción" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <input type="number" placeholder="Precio" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
      <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
      <button type="submit">{editing ? 'Actualizar' : 'Agregar'}</button>
    </form>
  )
}