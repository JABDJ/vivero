import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (isRegistering) {
      // Lógica de Registro
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) alert(error.message)
      else alert('Registro exitoso! Revisa tu correo o inicia sesión.')
    } else {
      // Lógica de Login
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) alert(error.message)
      else navigate('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      {/* Elementos decorativos de fondo (Glow effects) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>

      <div className="card w-full max-w-md bg-[#1e293b]/80 backdrop-blur-md shadow-2xl border border-white/5">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center text-white mb-2">
            {isRegistering ? 'Crear Cuenta' : 'Bienvenido'}
          </h2>
          <p className="text-center text-gray-400 mb-6">
            {isRegistering ? 'Regístrate para gestionar tu inventario' : 'Ingresa a tu panel de administración'}
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text text-gray-300">Email</span></label>
              <input 
                type="email" 
                placeholder="admin@adaptshop.com" 
                className="input input-bordered bg-[#0f172a] border-gray-700 text-white focus:border-blue-500" 
                required 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text text-gray-300">Contraseña</span></label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="input input-bordered bg-[#0f172a] border-gray-700 text-white focus:border-blue-500" 
                required 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>

            <button className="btn btn-primary w-full bg-blue-600 hover:bg-blue-700 border-none text-white text-lg mt-4 shadow-lg shadow-blue-500/30">
              {loading ? <span className="loading loading-spinner"></span> : (isRegistering ? 'Registrarse' : 'Iniciar Sesión')}
            </button>
          </form>

          <div className="divider divider-neutral">o</div>

          <p className="text-center text-sm text-gray-400">
            {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
            <button 
              onClick={() => setIsRegistering(!isRegistering)} 
              className="ml-2 text-blue-400 hover:text-blue-300 font-semibold underline bg-transparent border-none cursor-pointer"
            >
              {isRegistering ? 'Inicia sesión' : 'Regístrate gratis'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}