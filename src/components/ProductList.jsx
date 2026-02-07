import { supabase } from '../supabaseClient'

export default function ProductList({ products, fetchProducts, setEditing }) {
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
      alert("Error al eliminar: " + error.message)
    } else {
      fetchProducts()
    }
  }

  if (!products || products.length === 0) {
    return <div className="p-12 text-center text-gray-500">No hay productos registrados aún.</div>
  }

  return (
    <table className="table w-full text-left">
      <thead className="bg-surface text-gray-400 font-medium uppercase text-xs tracking-wider border-b border-gray-700">
        <tr>
          <th className="py-4 pl-6">Imagen</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Subcategoría</th>
          <th>Stock</th>
          <th>Precio</th>
          <th>Estado</th>
          <th className="text-right pr-6">Acciones</th>
        </tr>
      </thead>
      <tbody className="text-gray-300 divide-y divide-gray-700/50">
        {products.map(p => (
          <tr key={p.id} className="hover:bg-white/5 transition-colors group">
            <td className="py-4 pl-6">
              <div className="avatar">
                <div className="w-12 h-12 rounded-lg overflow-hidden ring-1 ring-white/10">
                  {p.imagen_url ? (
                    <img
                      src={p.imagen_url}
                      alt={p.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"%3E%3Crect fill="%23374151" width="48" height="48"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="10" fill="%239CA3AF"%3EIMG%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                      IMG
                    </div>
                  )}
                </div>
              </div>
            </td>
            <td>
              {/* CORRECCIÓN AQUÍ: p.nombre en lugar de p.name */}
              <div className="font-bold text-white group-hover:text-primary transition-colors">{p.nombre}</div>
              {/* CORRECCIÓN AQUÍ: p.descripcion en lugar de p.description */}
              <div className="text-xs text-gray-500 truncate max-w-[150px]">{p.descripcion}</div>
            </td>
            <td>
              {/* CORRECCIÓN AQUÍ: p.categoria */}
              <span className="badge bg-blue-500/10 text-blue-400 border-none text-xs font-semibold px-3 py-2">
                {p.categoria || 'General'}
              </span>
            </td>
            <td>
              {/* Subcategoría */}
              {p.subcategoria ? (
                <span className="badge bg-purple-500/10 text-purple-400 border-none text-xs font-semibold px-3 py-2">
                  {p.subcategoria}
                </span>
              ) : (
                <span className="text-gray-600 text-xs">-</span>
              )}
            </td>
            <td>
              {/* Stock con indicador visual */}
              <span className={`badge border-none text-xs font-semibold px-3 py-2 ${p.stock === 0
                  ? 'bg-red-500/10 text-red-400'
                  : p.stock <= 5
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'bg-gray-500/10 text-gray-400'
                }`}>
                {p.stock || 0}
              </span>
            </td>
            <td className="font-mono text-emerald-400 font-bold">
              {/* CORRECCIÓN AQUÍ: p.precio */}
              ${p.precio}
            </td>
            <td>
              {/* Estado de disponibilidad */}
              <span className={`badge border-none text-xs font-semibold px-3 py-2 ${p.disponible !== false
                ? 'bg-green-500/10 text-green-400'
                : 'bg-red-500/10 text-red-400'
                }`}>
                {p.disponible !== false ? 'Disponible' : 'No disponible'}
              </span>
            </td>
            <td className="text-right pr-6">
              <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100">
                <button onClick={() => setEditing(p)} className="text-gray-400 hover:text-primary transition-colors">
                  Editar
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}