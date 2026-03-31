'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [clave, setClave] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!clave) return
    setCargando(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clave }),
      })
      if (!res.ok) {
        setError('Clave incorrecta. Intenta de nuevo.')
        return
      }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0E0C08] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-[#C9A84C] font-bold text-2xl">Rifas CR</h1>
          <p className="text-[#9E8A60] text-sm mt-1">Panel de administración</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-[#1A1612] border border-[rgba(201,168,76,0.2)] rounded-2xl p-6 space-y-4"
        >
          <div>
            <label className="block text-[#9E8A60] text-xs uppercase tracking-wider mb-1">
              Clave de acceso
            </label>
            <input
              type="password"
              value={clave}
              onChange={(e) => { setClave(e.target.value); setError('') }}
              placeholder="••••••••••••"
              autoFocus
              className="w-full bg-[#2C2518] border border-[rgba(201,168,76,0.2)] rounded-lg px-4 py-3 text-[#FAF6EE] placeholder-[#9E8A60] focus:outline-none focus:border-[#C9A84C]"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-900/30 rounded-lg px-4 py-3">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={cargando || !clave}
            className="w-full bg-[#C9A84C] hover:bg-[#E8C97A] disabled:opacity-50 text-[#0E0C08] font-bold py-3 rounded-lg transition-colors"
          >
            {cargando ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
