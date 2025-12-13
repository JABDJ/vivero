import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

// En src/components/ProductForm.jsx

export default function ProductForm({ fetchProducts, editing, setEditing, onClose }) {
  // 1. Asegúrate que el estado incluya 'category'
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    stock: '', 
    category: 'Belleza' // Valor por defecto
  })
  const [loading, setLoading] = useState(false)

  // Cargar datos si estamos editando
  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.nombre,           // Mapeamos lo que viene de la DB (español) al form (inglés)
        description: editing.descripcion,
        price: editing.precio,
        stock: editing.stock,
        category: editing.categoria || 'General'
      })
    } else {
      setForm({ name: '', description: '', price: '', stock: '', category: 'Belleza' })
    }
  }, [editing])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // 2. Preparamos los datos para Supabase (Traducción Inglés -> Español)
    const datosParaSupabase = {
      nombre: form.name,
      descripcion: form.description,
      precio: parseFloat(form.price), // Aseguramos que sea número
      stock: parseInt(form.stock),    // Aseguramos que sea entero
      categoria: form.category
    }

    try {
      if (editing) {
        // Actualizar
        const { error } = await supabase
          .from('products')
          .update(datosParaSupabase)
          .eq('id', editing.id)
        
        if (error) throw error
      } else {
        // Crear nuevo
        const { error } = await supabase
          .from('products')
          .insert([datosParaSupabase])
        
        if (error) throw error
      }
      
      fetchProducts()
      onClose()
      alert("Producto guardado correctamente")
    } catch (error) {
      console.error("Error detallado:", error)
      alert("Error al guardar: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  // ... el resto de tu return (JSX) sigue igual ...

  return (
    // Tarjeta Modal idéntica a la imagen 1
    <div className="bg-surface w-full max-w-lg rounded-2xl shadow-2xl border border-gray-700 p-8 relative animate-scale-up">
      <h2 className="text-2xl font-bold text-white mb-6">
        {editing ? 'Editar Producto' : 'Agregar Nuevo Producto'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Input: Nombre */}
        <div className="form-control">
          <label className="label text-gray-400 text-sm font-medium pb-1">Nombre del Producto</label>
          <input 
            className="input bg-[#111827] border border-gray-700 text-white w-full focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-600"
            placeholder="Ej: Auriculares Bluetooth"
            value={form.name} 
            required
            onChange={e => setForm({ ...form, name: e.target.value })} 
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Input: Precio */}
          <div className="form-control">
            <label className="label text-gray-400 text-sm font-medium pb-1">Precio ($)</label>
            <input 
              type="number" 
              className="input bg-[#111827] border border-gray-700 text-white w-full focus:border-primary"
              placeholder="0.00"
              value={form.price} 
              required
              onChange={e => setForm({ ...form, price: e.target.value })} 
            />
          </div>
          {/* Input: Categoría/Stock (Simulado como el select de la imagen) */}
          <div className="form-control">
            <label className="label text-gray-400 text-sm font-medium pb-1">Stock</label>
            <div className="flex gap-2">
              <input 
                type="number"
                className="input bg-[#111827] border border-gray-700 text-white w-full focus:border-primary"
                value={form.stock}
                placeholder="0"
                onChange={e => setForm({ ...form, stock: e.target.value })}
              />
              <button type="button" className="btn btn-square btn-primary text-lg font-bold">+</button>
            </div>
          </div>
        </div>

        <div className="form-control">
  <label className="label text-gray-400 text-sm font-medium pb-1">Categoría</label>
  <select 
    className="select bg-[#111827] border border-gray-700 text-white w-full focus:border-primary"
    value={form.category}
    onChange={e => setForm({ ...form, category: e.target.value })}
  >
    <option value="Belleza">Belleza</option>
    <option value="Perfumes">Perfumes</option>
    <option value="Muebles">Muebles</option>
    <option value="Tecnología">Tecnología</option>
  </select>
</div>

        {/* Input: Descripción */}
        <div className="form-control">
          <label className="label text-gray-400 text-sm font-medium pb-1">Descripción</label>
          <textarea 
            rows="3"
            className="textarea bg-[#111827] border border-gray-700 text-white w-full focus:border-primary resize-none text-base"
            placeholder="Detalles del producto..."
            value={form.description} 
            onChange={e => setForm({ ...form, description: e.target.value })} 
          ></textarea>
        </div>

        {/* Botones */}
        <div className="flex gap-4 mt-8">
          <button 
            type="button" 
            onClick={onClose}
            className="btn flex-1 bg-gray-700 hover:bg-gray-600 text-white border-none"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn flex-1 btn-primary text-white shadow-lg shadow-blue-600/30"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner"></span> : (editing ? 'Guardar Cambios' : 'Guardar Producto')}
          </button>
        </div>
      </form>
    </div>
  )
}