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
    category: 'Belleza', // Valor por defecto
    subcategory: '', // Nueva: Subcategoría
    imageUrl: '', // Nueva: URL o Base64 de la imagen
    available: true // Nueva: Disponibilidad (por defecto true)
  })
  const [loading, setLoading] = useState(false)
  const [imageMode, setImageMode] = useState('url') // 'url' o 'file'
  const [imagePreview, setImagePreview] = useState('') // Preview de la imagen
  const [imageError, setImageError] = useState('') // Errores de validación

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
        category: currentCategory,
        subcategory: editing.subcategoria || '',
        imageUrl: editing.imagen_url || '',
        available: editing.disponible !== undefined ? editing.disponible : true
      })

      // Configurar preview si hay imagen
      if (editing.imagen_url) {
        setImagePreview(editing.imagen_url)
        // Detectar si es URL o Base64
        setImageMode(editing.imagen_url.startsWith('data:') ? 'file' : 'url')
      }
    } else {
      // Resetear formulario para nuevo producto
      setForm({ name: '', description: '', price: '', stock: '', category: 'Belleza', subcategory: '', imageUrl: '', available: true })
      setIsCustomCategory(false)
      setImagePreview('')
      setImageError('')
      setImageMode('url')
    }
  }, [editing])

  // Función para convertir archivo a Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  // Manejar selección de archivo local
  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setImageError('Tipo de archivo no válido. Usa JPG, PNG, GIF o WebP')
      return
    }

    // Validar tamaño (2MB máximo)
    const maxSize = 2 * 1024 * 1024 // 2MB en bytes
    if (file.size > maxSize) {
      setImageError('El archivo es muy grande. Máximo 2MB')
      return
    }

    try {
      setImageError('')
      const base64 = await convertToBase64(file)
      setForm({ ...form, imageUrl: base64 })
      setImagePreview(base64)
    } catch (error) {
      setImageError('Error al procesar el archivo')
      console.error(error)
    }
  }

  // Manejar cambio de URL
  const handleUrlChange = (url) => {
    setForm({ ...form, imageUrl: url })
    setImagePreview(url)
    setImageError('')
  }

  // Limpiar imagen
  const clearImage = () => {
    setForm({ ...form, imageUrl: '' })
    setImagePreview('')
    setImageError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Preparamos los datos para Supabase
    const datosParaSupabase = {
      nombre: form.name,
      descripcion: form.description,
      precio: parseFloat(form.price),
      stock: parseInt(form.stock),
      categoria: form.category,
      subcategoria: form.subcategory || null,
      imagen_url: form.imageUrl || null,
      disponible: form.available
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
    <div className="bg-surface w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-gray-700 p-8 relative animate-scale-up">
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

        {/* Input: Subcategoría */}
        <div className="form-control">
          <label className="label text-gray-400 text-sm font-medium pb-1">Subcategoría (Opcional)</label>
          <input
            type="text"
            className="input bg-[#111827] border border-gray-700 text-white w-full focus:border-primary placeholder-gray-600"
            placeholder="Ej: Plantines, Macetas, Herramientas..."
            value={form.subcategory}
            onChange={e => setForm({ ...form, subcategory: e.target.value })}
          />
        </div>

        {/* Grid: Stock y Disponibilidad */}
        <div className="grid grid-cols-2 gap-5">
          {/* Input: Stock */}
          <div className="form-control">
            <label className="label text-gray-400 text-sm font-medium pb-1">Stock</label>
            <input
              type="number"
              className="input bg-[#111827] border border-gray-700 text-white w-full focus:border-primary"
              value={form.stock}
              placeholder="0"
              onChange={e => setForm({ ...form, stock: e.target.value })}
            />
          </div>

          {/* Toggle: Disponibilidad */}
          <div className="form-control">
            <label className="label text-gray-400 text-sm font-medium pb-1">Disponibilidad</label>
            <div className="flex items-center gap-3 h-12">
              <button
                type="button"
                onClick={() => setForm({ ...form, available: !form.available })}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface ${form.available ? 'bg-green-500' : 'bg-red-500'
                  }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${form.available ? 'translate-x-7' : 'translate-x-1'
                    }`}
                />
              </button>
              <span className={`text-sm font-medium ${form.available ? 'text-green-400' : 'text-red-400'}`}>
                {form.available ? 'Disponible' : 'No disponible'}
              </span>
            </div>
          </div>
        </div>

        {/* Input: Imagen del Producto */}
        <div className="form-control">
          <label className="label text-gray-400 text-sm font-medium pb-1">Imagen del Producto</label>

          {/* Tabs para seleccionar modo */}
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setImageMode('url')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${imageMode === 'url'
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-[#111827] text-gray-400 border border-gray-700 hover:border-primary'
                }`}
            >
              🔗 URL de Internet
            </button>
            <button
              type="button"
              onClick={() => setImageMode('file')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${imageMode === 'file'
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-[#111827] text-gray-400 border border-gray-700 hover:border-primary'
                }`}
            >
              📁 Archivo Local
            </button>
          </div>

          {/* Input según el modo seleccionado */}
          {imageMode === 'url' ? (
            <input
              type="text"
              className="input bg-[#111827] border border-gray-700 text-white w-full focus:border-primary placeholder-gray-600"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={form.imageUrl.startsWith('data:') ? '' : form.imageUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
            />
          ) : (
            <div className="relative">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="file-input file-input-bordered bg-[#111827] border-gray-700 text-white w-full focus:border-primary"
              />
              <p className="text-xs text-gray-500 mt-1">Máximo 2MB • JPG, PNG, GIF o WebP</p>
            </div>
          )}

          {/* Mensaje de error */}
          {imageError && (
            <div className="alert alert-error mt-2 py-2 px-3 text-sm bg-red-500/10 border border-red-500/50 text-red-400 animate-fade-in">
              ⚠️ {imageError}
            </div>
          )}

          {/* Preview de la imagen */}
          {imagePreview && (
            <div className="mt-3 flex items-center gap-3 p-3 bg-[#111827] border border-gray-700 rounded-lg animate-fade-in">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-lg ring-2 ring-primary/30"
                onError={() => setImageError('No se pudo cargar la imagen')}
              />
              <div className="flex-1">
                <p className="text-sm text-gray-400">Vista previa de la imagen</p>
                <p className="text-xs text-gray-600 truncate max-w-[200px]">
                  {form.imageUrl.startsWith('data:') ? 'Archivo local' : form.imageUrl}
                </p>
              </div>
              <button
                type="button"
                onClick={clearImage}
                className="btn btn-sm btn-ghost text-red-400 hover:bg-red-500/10"
                title="Eliminar imagen"
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