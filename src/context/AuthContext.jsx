import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  // Guardamos el email del último usuario que ya tiene rol asignado
  // para no re-fetchear en TOKEN_REFRESHED del mismo usuario
  const roleFetchedFor = useRef(null)

  // Consulta el rol con timeout de 15s
  const fetchRole = async (userEmail) => {
    if (!userEmail) return 'user'
    try {
      const timeout = new Promise((resolve) =>
        setTimeout(() => resolve({ data: null, error: new Error('timeout') }), 15000)
      )
      const query = supabase
        .from('profiles')
        .select('role')
        .eq('email', userEmail)
        .maybeSingle()

      const { data, error } = await Promise.race([query, timeout])
      if (error) {
        console.warn('fetchRole error/timeout:', error.message)
        return null   // null = "no cambiar el rol actual", no 'user'
      }
      return data?.role ?? 'user'
    } catch (e) {
      console.warn('fetchRole falló:', e)
      return null
    }
  }

  useEffect(() => {
    // Verificar sesión activa al cargar la app
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        setLoading(false)
        const fetchedRole = await fetchRole(session.user.email)
        if (fetchedRole !== null) {
          setRole(fetchedRole)
          roleFetchedFor.current = session.user.email
        }
      } else {
        setLoading(false)
      }
    }
    initAuth()

    // Escuchar cambios de sesión (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          setLoading(false)

          // Si es un refresco de token del MISMO usuario que ya tiene rol → no re-fetchear
          // Esto evita que el timeout devuelva 'user' y redirija al usuario
          if (event === 'TOKEN_REFRESHED' && roleFetchedFor.current === session.user.email) {
            return
          }

          const fetchedRole = await fetchRole(session.user.email)
          if (fetchedRole !== null) {
            setRole(fetchedRole)
            roleFetchedFor.current = session.user.email
          }
        } else {
          setUser(null)
          setRole(null)
          roleFetchedFor.current = null
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
    roleFetchedFor.current = null
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
