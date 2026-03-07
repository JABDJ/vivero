import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import AdminSidebar from '../components/AdminSidebar'
import { createClient } from '@supabase/supabase-js'

// Cliente separado para crear usuarios — persistSession:false evita tocar el localStorage del admin
const supabaseSignup = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: false,      // No guarda nada en localStorage
            autoRefreshToken: false,    // No necesita refrescar token
        }
    }
)

// ── MODAL de Nuevo / Editar Usuario ────────────────────────────────────────
function UsuarioModal({ onClose, onRefresh }) {
    const [form, setForm] = useState({ email: '', password: '', role: 'vendedor' })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError(null)
        try {
            // 1. Crear usuario en Supabase Auth con cliente sin persistencia
            const { error: signUpError } = await supabaseSignup.auth.signUp({
                email: form.email,
                password: form.password,
            })
            // Si el usuario ya existe en auth.users, solo actualizamos su perfil
            if (signUpError && !signUpError.message.toLowerCase().includes('already registered')) {
                throw signUpError
            }

            // 2. Registrar/actualizar en profiles con el rol asignado
            //    (upsert por si el trigger ya creó la fila con role='user')
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({ email: form.email, role: form.role }, { onConflict: 'email' })
            if (profileError) throw profileError

            // 3. Mostrar éxito y refrescar lista
            setSuccess(true)
            onRefresh()
            setTimeout(() => {
                setSuccess(false)
                setForm({ email: '', password: '', role: 'user' })
                onClose()
            }, 1500)
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6">

                {/* Header del modal */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Nuevo Usuario</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Correo electrónico</label>
                        <input
                            type="email" required placeholder="usuario@ejemplo.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full bg-gray-800/60 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Contraseña</label>
                        <input
                            type="password" required placeholder="Mínimo 6 caracteres" minLength={6}
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full bg-gray-800/60 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Rol */}
                    <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Rol</label>
                        <select
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                            className="w-full bg-gray-800/60 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="vendedor">Vendedor</option>
                            <option value="admin">Administrador</option>
                            <option value="user">Usuario</option>
                        </select>
                    </div>

                    {/* Éxito */}
                    {success && (
                        <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
                            ✅ Usuario creado exitosamente
                        </p>
                    )}

                    {/* Error */}
                    {error && (
                        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                            ❌ {error}
                        </p>
                    )}

                    {/* Botones */}
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 text-sm font-medium transition-all">
                            Cancelar
                        </button>
                        <button type="submit" disabled={saving}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold disabled:opacity-50 transition-all shadow-lg shadow-blue-500/30">
                            {saving ? 'Creando...' : 'Crear Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ── TABLA de Usuarios ───────────────────────────────────────────────────────
function UsuarioList({ usuarios, onChangeRole, onDelete }) {
    if (!usuarios || usuarios.length === 0) {
        return (
            <div className="p-12 text-center text-gray-500">
                No hay usuarios registrados aún.
            </div>
        )
    }

    return (
        <table className="table w-full text-left">
            <thead className="bg-surface text-gray-400 font-medium uppercase text-xs tracking-wider border-b border-gray-700">
                <tr>
                    <th className="py-4 pl-6">Email</th>
                    <th>Rol</th>
                    <th className="text-right pr-6">Acciones</th>
                </tr>
            </thead>
            <tbody className="text-gray-300 divide-y divide-gray-700/50">
                {usuarios.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                        <td className="py-4 pl-6">
                            {/* Avatar inicial */}
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sm font-bold text-blue-400">
                                    {u.email?.[0]?.toUpperCase() ?? '?'}
                                </div>
                                <span className="text-white font-medium">{u.email}</span>
                            </div>
                        </td>
                        <td>
                            <span className={`badge border-none text-xs font-semibold px-3 py-2 ${u.role === 'admin' ? 'bg-blue-500/10 text-blue-400'
                                : u.role === 'vendedor' ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'bg-gray-500/10 text-gray-400'
                                }`}>
                                {u.role === 'admin' ? 'Administrador' : u.role === 'vendedor' ? 'Vendedor' : 'Usuario'}
                            </span>
                        </td>
                        <td className="text-right pr-6">
                            <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100">
                                {/* Selector de rol */}
                                <select
                                    value={u.role}
                                    onChange={(e) => onChangeRole(u.email, e.target.value)}
                                    className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="vendedor">Vendedor</option>
                                    <option value="admin">Administrador</option>
                                    <option value="user">Usuario</option>
                                </select>
                                {/* Eliminar */}
                                <button
                                    onClick={() => onDelete(u.email)}
                                    className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
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

// ── PÁGINA PRINCIPAL ────────────────────────────────────────────────────────
export default function GestionUsuarios() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const [usuarios, setUsuarios] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchUsuarios = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('id, email, role')
            .order('email', { ascending: true })
        setUsuarios(data || [])
    }

    useEffect(() => { fetchUsuarios() }, [])

    const handleChangeRole = async (email, newRole) => {
        await supabase.from('profiles').update({ role: newRole }).eq('email', email)
        fetchUsuarios()
    }

    const handleDelete = async (email) => {
        if (!window.confirm(`¿Eliminar el perfil de ${email}?`)) return
        await supabase.from('profiles').delete().eq('email', email)
        fetchUsuarios()
    }

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    return (
        <div className="flex h-screen w-full bg-background text-white overflow-hidden font-sans">

            {/* SIDEBAR */}
            <AdminSidebar />


            {/* CONTENIDO PRINCIPAL */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
                <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />

                {/* Header igual al de productos */}
                <header className="flex justify-between items-center p-8 z-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Gestión de Usuarios</h1>
                        <p className="text-gray-400 text-sm mt-1">Administra los usuarios y sus roles</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn bg-primary hover:bg-blue-600 text-white border-none px-6 rounded-lg shadow-lg shadow-blue-500/30"
                    >
                        + Nuevo Usuario
                    </button>
                </header>

                {/* Tabla */}
                <div className="flex-1 overflow-auto px-8 pb-8 z-10">
                    <div className="bg-surface/50 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                        <UsuarioList
                            usuarios={usuarios}
                            onChangeRole={handleChangeRole}
                            onDelete={handleDelete}
                        />
                    </div>
                </div>
            </main>

            {/* MODAL */}
            {isModalOpen && (
                <UsuarioModal
                    onClose={() => setIsModalOpen(false)}
                    onRefresh={fetchUsuarios}
                />
            )}
        </div>
    )
}
