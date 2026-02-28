import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  // Consulta el rol con un timeout de 5s para no bloquear jamás la UI
  const fetchRole = async (userEmail) => {
    if (!userEmail) return 'user'
    try {
      const timeout = new Promise((resolve) =>
        setTimeout(() => resolve({ data: null, error: new Error('timeout') }), 5000)
      )
      const query = supabase
        .from('profiles')
        .select('role')
        .eq('email', userEmail)
        .maybeSingle()

      const { data, error } = await Promise.race([query, timeout])
      if (error) {
        console.warn('fetchRole error/timeout:', error.message)
        return 'user'
      }
      return data?.role ?? 'user'
    } catch (e) {
      console.warn('fetchRole falló:', e)
      return 'user'
    }
  }

  useEffect(() => {
    // Verificar sesión activa al cargar la app
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // ✅ Desbloquear la UI primero, luego cargar el rol en background
        setUser(session.user)
        setLoading(false)
        const fetchedRole = await fetchRole(session.user.email)
        setRole(fetchedRole)
      } else {
        setLoading(false)
      }
    }
    initAuth()

    // Escuchar cambios de sesión (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          // ✅ Desbloquear la UI inmediatamente, rol llega después
          setUser(session.user)
          setLoading(false)
          const fetchedRole = await fetchRole(session.user.email)
          setRole(fetchedRole)
        } else {
          setUser(null)
          setRole(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para consumir el contexto fácilmente
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return context
}
