import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Estado para controlar si el usuario quiere Registrarse (true) o Iniciar Sesión (false)
  const [isSignUp, setIsSignUp] = useState(false)
  
  const navigate = useNavigate()

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (isSignUp) {
        // Lógica de REGISTRO
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        alert('¡Registro exitoso! Por favor revisa tu correo para confirmar tu cuenta antes de iniciar sesión.')
        setIsSignUp(false) // Cambiamos a modo login automáticamente
      } else {
        // Lógica de LOGIN
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        navigate('/dashboard')
      }
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-[#0f172a]">
      
      {/* SECCIÓN IZQUIERDA: Imagen (Oculta en móviles) */}
      <div className="hidden lg:flex w-1/2 relative bg-cover bg-center items-center justify-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614735241165-6756e1dfa8ab?q=80&w=2232&auto=format&fit=crop')" }}>
           {/* Nota: He cambiado la imagen a una con tonos más fríos/azules que combina mejor */}
        
        {/* Overlay oscuro azulado */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-black/50 to-black/30"></div>
        
        <div className="relative z-10 p-12 text-white max-w-xl">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            {isSignUp ? 'Únete a nosotros' : 'Bienvenido de nuevo'}
          </h1>
          <p className="text-lg text-blue-100 mb-8">
            {isSignUp 
              ? 'Crea tu cuenta hoy y empieza a gestionar tu inventario de manera profesional.'
              : 'Gestiona tu inventario, categorías y productos en un entorno moderno y azul.'}
          </p>
        </div>
      </div>

      {/* SECCIÓN DERECHA: Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 bg-[#111827]">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {isSignUp ? 'Ingresa tus datos para registrarte' : 'Accede al panel de administración'}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleAuth}>
            <div className="space-y-5">
              
              {/* Input Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-700 rounded-2xl bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Input Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-700 rounded-2xl bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Botón Principal (Azul) */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] shadow-lg shadow-blue-500/30"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  isSignUp ? 'Crear Cuenta' : 'Ingresar al Sistema'
                )}
              </button>
            </div>

            {/* Toggle Login/Registro */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                {isSignUp 
                  ? '¿Ya tienes una cuenta? Inicia sesión aquí' 
                  : '¿No tienes cuenta? Regístrate gratis'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}