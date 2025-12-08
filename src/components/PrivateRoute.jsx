import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
  }, [])

  if (loading) return <p>Cargando...</p>
  return user ? children : <Navigate to="/" />
}