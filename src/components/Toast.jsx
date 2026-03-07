import { useEffect, useState } from 'react'

const ICONS = {
    success: (
        <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    error: (
        <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    info: (
        <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
}

const COLORS = {
    success: { border: 'border-emerald-500/40', bar: 'bg-emerald-500' },
    error: { border: 'border-red-500/40', bar: 'bg-red-500' },
    info: { border: 'border-cyan-500/40', bar: 'bg-cyan-500' },
}

/**
 * Toast de notificación con auto-dismiss.
 *
 * Props:
 *   message  string
 *   type     'success' | 'error' | 'info'
 *   duration número en ms (default 3000)
 *   onClose  función a llamar al cerrar
 */
export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        // Animar entrada
        requestAnimationFrame(() => setVisible(true))
        const timer = setTimeout(() => {
            setVisible(false)
            setTimeout(onClose, 300)  // esperar salida antes de quitar del DOM
        }, duration)
        return () => clearTimeout(timer)
    }, [duration, onClose])

    const { border, bar } = COLORS[type] || COLORS.success

    return (
        <div
            className={`
        flex items-start gap-3 min-w-[280px] max-w-sm w-full
        bg-[#0d1e2e] border ${border} rounded-xl px-4 py-3
        shadow-2xl shadow-black/50
        transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
        >
            {ICONS[type] || ICONS.success}
            <span className="text-sm text-white leading-snug flex-1">{message}</span>
            <button
                onClick={() => { setVisible(false); setTimeout(onClose, 300) }}
                className="text-gray-600 hover:text-gray-300 transition-colors mt-0.5 flex-shrink-0"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            {/* Barra de progreso */}
            <style>{`
        @keyframes shrink { from { width: 100% } to { width: 0% } }
      `}</style>
            <div
                className={`absolute bottom-0 left-0 h-[3px] ${bar} rounded-b-xl`}
                style={{ animation: `shrink ${duration}ms linear forwards` }}
            />
        </div>
    )
}

/**
 * Contenedor global de toasts. Colócalo en el root de la app o en cada página.
 * Expone addToast(message, type) via ref o como hook.
 *
 * Uso más sencillo: import { useToast } + <ToastContainer />
 */

let _globalAdd = null

export function useToast() {
    return { toast: (message, type = 'success') => _globalAdd?.(message, type) }
}

export function ToastContainer() {
    const [toasts, setToasts] = useState([])

    useEffect(() => {
        _globalAdd = (message, type) => {
            const id = Date.now()
            setToasts(prev => [...prev, { id, message, type }])
        }
        return () => { _globalAdd = null }
    }, [])

    return (
        <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
            {toasts.map(t => (
                <div key={t.id} className="pointer-events-auto relative">
                    <Toast
                        message={t.message}
                        type={t.type}
                        onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
                    />
                </div>
            ))}
        </div>
    )
}
