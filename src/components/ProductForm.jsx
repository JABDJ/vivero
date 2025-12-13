import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

// En src/components/ProductForm.jsx

export default function ProductForm({ fetchProducts, editing, setEditing, onClose }) {
  // Estado para controlar si estamos escribiendo una categoría nueva
  const [isCustomCategory, setIsCustomCategory] = useState(false)

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
      const predefinedCategories = ["Belleza", "Perfumes", "Muebles", "Tecnología"];
      const currentCategory = editing.categoria || 'General';
      
      // Si la categoría que viene de la DB NO está en la lista fija, activamos el modo texto
      const isCustom = !predefinedCategories.includes(currentCategory);
      setIsCustomCategory(isCustom);

      setForm({
        name: editing.nombre,           
        description: editing.descripcion,
        price: editing.precio,
        stock: editing.stock,
        category: currentCategory
      })
    } else {
      // Resetear formulario para nuevo producto
      setForm({ name: '', description: '', price: '', stock: '', category: 'Belleza' })
      setIsCustomCategory(false)
    }
  }, [editing])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Preparamos los datos para Supabase
    const datosParaSupabase = {
      nombre: form.name,
      descripcion: form.description,
      precio: parseFloat(form.price),
      stock: parseInt(form.stock),
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

  return (
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
          {/* Input: Stock */}
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
              
            </div>
          </div>
        </div>

        {/* Input: Categoría (Modificado para soportar nueva categoría) */}
        <div className="form-control">
          <label className="label text-gray-400 text-sm font-medium pb-1">Categoría</label>
          
          {!isCustomCategory ? (
            // Opción A: Select Normal
            <select 
              className="select bg-[#111827] border border-gray-700 text-white w-full focus:border-primary"
              value={form.category}
              onChange={e => {
                if (e.target.value === 'custom_option_value') {
                  setIsCustomCategory(true);
                  setForm({ ...form, category: '' }); // Limpiamos para que escriba
                } else {
                  setForm({ ...form, category: e.target.value });
                }
              }}
            >
              <option value="Belleza">Belleza</option>
              <option value="Perfumes">Perfumes</option>
              <option value="Muebles">Muebles</option>
              <option value="Tecnología">Tecnología</option>
              <option value="custom_option_value" className="font-bold text-blue-400 bg-gray-900">+ Nueva Categoría</option>
            </select>
          ) : (
            // Opción B: Input de Texto Libre
            <div className="flex gap-2 animate-fade-in">
              <input 
                type="text" 
                className="input bg-[#111827] border border-gray-700 text-white w-full focus:border-primary placeholder-gray-500"
                placeholder="Escribe la nueva categoría..."
                value={form.category}
                autoFocus
                onChange={e => setForm({ ...form, category: e.target.value })}
              />
              <button 
                type="button" 
                onClick={() => {
                  setIsCustomCategory(false);
                  setForm({ ...form, category: 'Belleza' }); // Volver a un valor por defecto seguro
                }}
                className="btn btn-square btn-ghost text-red-400 hover:bg-red-500/10 border border-gray-700"
                title="Cancelar y volver a la lista"
              >
                ✕
              </button>
            </div>
          )}
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