'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'

interface NumeroAsignado {
  numero: number
}

interface Participacion {
  rifa_nombre: string
  premio: string
  numeros: NumeroAsignado[]
  fecha: string
}

export default function MisNumerosPage() {
  const [tipoBusqueda, setTipoBusqueda] = useState<'cedula' | 'correo'>('cedula')
  const [valor, setValor] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [resultados, setResultados] = useState<Participacion[] | null>(null)

  async function handleBuscar(e: React.FormEvent) {
    e.preventDefault()
    if (!valor.trim()) {
      setError('Ingresa tu cédula o correo.')
      return
    }
    setCargando(true)
    setError('')
    setResultados(null)
    try {
      const param = tipoBusqueda === 'cedula' ? `cedula=${encodeURIComponent(valor.trim())}` : `correo=${encodeURIComponent(valor.trim())}`
      const res = await fetch(`/api/public/buscar-numeros?${param}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Error al buscar. Intenta de nuevo.')
        return
      }
      setResultados(data)
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0E0C08]">
      <Header />
      <div className="pt-16">
        <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-[#FAF6EE]">Mis Números</h1>
            <p className="text-[#9E8A60]">Consulta los números que tienes asignados en la rifa.</p>
          </div>

          <div className="bg-[#1A1612] border border-[rgba(201,168,76,0.2)] rounded-2xl p-6 space-y-5">
            <div className="flex rounded-lg overflow-hidden border border-[rgba(201,168,76,0.2)]">
              <button
                onClick={() => { setTipoBusqueda('cedula'); setValor(''); setResultados(null); setError('') }}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                  tipoBusqueda === 'cedula'
                    ? 'bg-[#C9A84C] text-[#0E0C08]'
                    : 'text-[#9E8A60] hover:text-[#FAF6EE]'
                }`}
              >
                Por cédula
              </button>
              <button
                onClick={() => { setTipoBusqueda('correo'); setValor(''); setResultados(null); setError('') }}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                  tipoBusqueda === 'correo'
                    ? 'bg-[#C9A84C] text-[#0E0C08]'
                    : 'text-[#9E8A60] hover:text-[#FAF6EE]'
                }`}
              >
                Por correo
              </button>
            </div>

            <form onSubmit={handleBuscar} className="space-y-4">
              <input
                value={valor}
                onChange={(e) => { setValor(e.target.value); setError('') }}
                placeholder={tipoBusqueda === 'cedula' ? 'Número de cédula' : 'Correo electrónico'}
                type={tipoBusqueda === 'correo' ? 'email' : 'text'}
                className="w-full bg-[#2C2518] border border-[rgba(201,168,76,0.2)] rounded-lg px-4 py-3 text-[#FAF6EE] placeholder-[#9E8A60] focus:outline-none focus:border-[#C9A84C]"
              />
              {error && (
                <p className="text-red-400 text-sm bg-red-900/20 border border-red-900/30 rounded-lg px-4 py-3">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-[#C9A84C] hover:bg-[#E8C97A] disabled:opacity-50 text-[#0E0C08] font-bold py-3 rounded-lg transition-colors"
              >
                {cargando ? 'Buscando...' : 'Buscar mis números'}
              </button>
            </form>
          </div>

          {resultados !== null && (
            <div className="space-y-4">
              {resultados.length === 0 ? (
                <div className="bg-[#1A1612] border border-[rgba(201,168,76,0.2)] rounded-2xl p-8 text-center">
                  <p className="text-[#9E8A60]">No encontramos participaciones con ese dato.</p>
                  <p className="text-[#9E8A60] text-sm mt-2">
                    Si acabas de participar, verifica que ingresaste la misma cédula del formulario.
                  </p>
                </div>
              ) : (
                resultados.map((p, i) => (
                  <div key={i} className="bg-[#1A1612] border border-[rgba(201,168,76,0.2)] rounded-2xl p-6 space-y-4">
                    <div>
                      <p className="text-[#E8C97A] font-bold text-lg">{p.rifa_nombre}</p>
                      <p className="text-[#9E8A60] text-sm">Premio: {p.premio}</p>
                    </div>
                    <div>
                      <p className="text-[#9E8A60] text-xs uppercase tracking-wider mb-3">
                        {p.numeros.length} números asignados
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {p.numeros.map((n) => (
                          <span
                            key={n.numero}
                            className="bg-[#2C2518] border border-[#C9A84C]/50 text-[#E8C97A] font-mono font-bold text-base px-3 py-2 rounded-lg min-w-[3.5rem] text-center"
                          >
                            {String(n.numero).padStart(4, '0')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="text-center">
            <Link href="/" className="text-[#C9A84C] hover:text-[#E8C97A] text-sm transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
