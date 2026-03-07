import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

// Logo JABDJ usando texto con gradiente SVG — fiel al original
function JABDJLogo({ className = '' }) {
  return (
    <svg viewBox="0 0 320 90" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#29ABE2" />
          <stop offset="45%" stopColor="#00C9C9" />
          <stop offset="100%" stopColor="#00D97E" />
        </linearGradient>
      </defs>
      <text
        x="50%" y="72"
        textAnchor="middle"
        fontFamily="'Arial Black', 'Impact', sans-serif"
        fontWeight="900"
        fontSize="80"
        letterSpacing="-2"
        fill="url(#g1)"
      >JABDJ</text>
    </svg>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      let userRole = 'user'
      try {
        const { data: p } = await supabase
          .from('profiles').select('role').eq('email', data.user.email).maybeSingle()
        userRole = p?.role ?? 'user'
      } catch { /* usa 'user' */ }

      if (userRole === 'admin') navigate('/dashboard')
      else if (userRole === 'vendedor') navigate('/vendedor')
      else navigate('/inicio')
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#07111b' }} className="relative flex min-h-screen w-full overflow-hidden">

      {/* ── Orbes de fondo con colores del logo ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20 blur-[110px]"
          style={{ background: 'radial-gradient(circle, #29ABE2, transparent 70%)' }} />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20 blur-[110px]"
          style={{ background: 'radial-gradient(circle, #00D97E, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-10 blur-[90px]"
          style={{ background: 'radial-gradient(circle, #00C9C9, transparent 70%)' }} />
        {/* Líneas de grid muy sutiles */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#00C9C9 1px,transparent 1px),linear-gradient(90deg,#00C9C9 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      {/* ── Panel izquierdo (solo desktop) ── */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center relative z-10 px-16 gap-10">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <JABDJLogo className="w-72" />
          {/* Línea gradiente */}
          <div className="w-48 h-[3px] rounded-full" style={{ background: 'linear-gradient(90deg, #29ABE2, #00C9C9, #00D97E)' }} />
          <p className="text-center text-gray-400 text-sm max-w-xs leading-relaxed mt-2">
            Sistema integrado de gestión de inventario, facturación y usuarios.
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {[
            { icon: '📦', text: 'Control de inventario en tiempo real' },
            { icon: '🧾', text: 'Facturación rápida y precisa' },
            { icon: '👥', text: 'Gestión de roles y usuarios' },
          ].map((f, i) => (
            <div key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-gray-300"
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(0,201,201,0.2)' }}>
              <span className="text-lg">{f.icon}</span>
              {f.text}
            </div>
          ))}
        </div>
      </div>

      {/* ── Panel derecho — Formulario ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative z-10 p-6">
        <div className="w-full max-w-md">

          {/* Logo en móvil */}
          <div className="flex lg:hidden flex-col items-center mb-8 gap-2">
            <JABDJLogo className="w-56" />
            <div className="w-32 h-[2px] rounded-full" style={{ background: 'linear-gradient(90deg, #29ABE2, #00D97E)' }} />
          </div>

          {/* Card */}
          <div className="rounded-2xl p-8 sm:p-10 border"
            style={{
              background: 'rgba(6, 18, 30, 0.85)',
              borderColor: 'rgba(0, 201, 201, 0.2)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,201,201,0.08)',
            }}>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">Bienvenido de vuelta</h2>
              <p className="mt-1 text-sm text-gray-500">Ingresa tus credenciales para continuar</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-widest" style={{ color: '#00C9C9' }}>
                  Correo electrónico
                </label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#00C9C9' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email" required autoComplete="email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      color: '#fff',
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm
                      placeholder-gray-600 outline-none transition-all
                      focus:border-[#00C9C9] focus:ring-2 focus:ring-[#00C9C9]/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-widest" style={{ color: '#00C9C9' }}>
                  Contraseña
                </label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#00C9C9' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type="password" required autoComplete="current-password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      color: '#fff',
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm
                      placeholder-gray-600 outline-none transition-all
                      focus:border-[#00C9C9] focus:ring-2 focus:ring-[#00C9C9]/20"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm px-4 py-2.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit" disabled={loading}
                className="relative w-full py-3.5 rounded-xl font-bold text-white text-sm overflow-hidden
                  transition-all duration-200 active:scale-[0.98] disabled:opacity-60 group"
                style={{ background: 'linear-gradient(90deg, #29ABE2, #00C9C9 50%, #00D97E)', boxShadow: '0 4px 20px rgba(0,201,201,0.3)' }}
              >
                {/* Shimmer hover */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                  -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Ingresando...
                    </>
                  ) : 'Ingresar al Sistema'}
                </span>
              </button>

            </form>

            <p className="mt-6 text-center text-xs text-gray-700">
              JABDJ &copy; {new Date().getFullYear()} &mdash; Sistema de Gestión
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}