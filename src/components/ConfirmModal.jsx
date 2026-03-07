/**
 * Modal de confirmación estilizado — reemplaza window.confirm()
 *
 * Props:
 *   title    string
 *   message  string
 *   onConfirm  función al confirmar
 *   onCancel   función al cancelar
 *   danger   bool (botón rojo en lugar de default)
 */
export default function ConfirmModal({ title, message, onConfirm, onCancel, danger = true }) {
    return (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-[#0a1929] shadow-2xl shadow-black/60 overflow-hidden">
                {/* Franja de acento */}
                <div className={`h-1 w-full ${danger ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-cyan-500 to-emerald-500'}`} />

                <div className="p-6">
                    {/* Ícono */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${danger ? 'bg-red-500/10 border border-red-500/30' : 'bg-cyan-500/10 border border-cyan-500/30'}`}>
                        {danger ? (
                            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{message}</p>

                    {/* Botones */}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 text-sm font-medium
                hover:border-gray-500 hover:text-white transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-all
                ${danger
                                    ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20'
                                    : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 shadow-lg shadow-cyan-500/20'
                                }`}
                        >
                            {danger ? 'Eliminar' : 'Confirmar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
