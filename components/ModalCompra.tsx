'use client'

import { useState } from 'react'

interface Props {
  rifaNombre: string
  whatsappNumber: string
  nequiNumber: string
  onClose: () => void
}

type Paso = 'instrucciones' | 'formulario' | 'resultado'

interface ResultadoCodigo {
  numeros: number[]
  rifa_nombre: string
  premio: string
  combo: number
}

const COMBOS = [
  { cantidad: 10, precio: '$15.000' },
  { cantidad: 20, precio: '$30.000' },
  { cantidad: 40, precio: '$60.000' },
]

export default function ModalCompra({ rifaNombre, whatsappNumber, nequiNumber, onClose }: Props) {
  const [paso, setPaso] = useState<Paso>('instrucciones')
  const [comboSeleccionado, setComboSeleccionado] = useState<number | null>(null)
  const [form, setForm] = useState({ codigo: '', nombre: '', telefono: '', cedula: '', correo: '' })
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState<ResultadoCodigo | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.codigo || !form.nombre || !form.telefono || !form.cedula) {
      setError('Por favor completa todos los campos obligatorios.')
      return
    }
    setCargando(true)
    setError('')
    try {
      const res = await fetch('/api/public/usar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Error inesperado. Intenta de nuevo.')
        return
      }
      setResultado(data)
      setPaso('resultado')
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1A1612] border border-[rgba(201,168,76,0.2)] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[rgba(201,168,76,0.15)]">
          <h2 className="text-[#E8C97A] font-bold text-lg">
            {paso === 'instrucciones' && 'Cómo participar'}
            {paso === 'formulario' && 'Redimir código'}
            {paso === 'resultado' && '¡Tus números!'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#9E8A60] hover:text-[#FAF6EE] transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5">
          {/* Paso 1: Instrucciones */}
          {paso === 'instrucciones' && (
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#C9A84C] text-[#0E0C08] font-bold text-sm flex items-center justify-center">1</span>
                  <p className="text-[#FAF6EE] text-sm pt-0.5">
                    Elige tu combo y realiza el pago por <strong className="text-[#E8C97A]">Nequi al {nequiNumber}</strong>
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#C9A84C] text-[#0E0C08] font-bold text-sm flex items-center justify-center">2</span>
                  <p className="text-[#FAF6EE] text-sm pt-0.5">
                    Envía el comprobante de pago por WhatsApp
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#C9A84C] text-[#0E0C08] font-bold text-sm flex items-center justify-center">3</span>
                  <p className="text-[#FAF6EE] text-sm pt-0.5">
                    Recibirás un código único por WhatsApp
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#C9A84C] text-[#0E0C08] font-bold text-sm flex items-center justify-center">4</span>
                  <p className="text-[#FAF6EE] text-sm pt-0.5">
                    Ingresa el código aquí y obtén tus números al instante
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[#9E8A60] text-xs uppercase tracking-wider">Elige tu combo</p>
                <div className="grid grid-cols-3 gap-2">
                  {COMBOS.map((c) => (
                    <button
                      key={c.cantidad}
                      onClick={() => setComboSeleccionado(c.cantidad)}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        comboSeleccionado === c.cantidad
                          ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#E8C97A]'
                          : 'border-[rgba(201,168,76,0.2)] text-[#9E8A60] hover:border-[#C9A84C]/50'
                      }`}
                    >
                      <div className="font-bold text-lg">{c.cantidad}</div>
                      <div className="text-xs">números</div>
                      <div className="text-xs font-semibold mt-1">{c.precio}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    `Hola, quiero participar en la rifa "${rifaNombre}"${comboSeleccionado ? ` con el combo de ${comboSeleccionado} números` : ''}. Adjunto mi comprobante de pago.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold py-3 rounded-lg text-sm text-center transition-colors"
                >
                  Ir a WhatsApp
                </a>
                <button
                  onClick={() => setPaso('formulario')}
                  className="flex-1 bg-[#C9A84C] hover:bg-[#E8C97A] text-[#0E0C08] font-semibold py-3 rounded-lg text-sm transition-colors"
                >
                  Ya tengo código
                </button>
              </div>
            </div>
          )}

          {/* Paso 2: Formulario */}
          {paso === 'formulario' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#9E8A60] text-xs uppercase tracking-wider mb-1">
                  Código de pago *
                </label>
                <input
                  name="codigo"
                  value={form.codigo}
                  onChange={handleChange}
                  placeholder="RC-XXXX-XX"
                  className="w-full bg-[#2C2518] border border-[rgba(201,168,76,0.2)] rounded-lg px-4 py-3 text-[#FAF6EE] placeholder-[#9E8A60] focus:outline-none focus:border-[#C9A84C] uppercase text-center tracking-widest font-mono text-lg"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[#9E8A60] text-xs uppercase tracking-wider mb-1">
                  Nombre completo *
                </label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  className="w-full bg-[#2C2518] border border-[rgba(201,168,76,0.2)] rounded-lg px-4 py-3 text-[#FAF6EE] placeholder-[#9E8A60] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div>
                <label className="block text-[#9E8A60] text-xs uppercase tracking-wider mb-1">
                  Teléfono *
                </label>
                <input
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="3001234567"
                  type="tel"
                  className="w-full bg-[#2C2518] border border-[rgba(201,168,76,0.2)] rounded-lg px-4 py-3 text-[#FAF6EE] placeholder-[#9E8A60] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div>
                <label className="block text-[#9E8A60] text-xs uppercase tracking-wider mb-1">
                  Cédula *
                </label>
                <input
                  name="cedula"
                  value={form.cedula}
                  onChange={handleChange}
                  placeholder="1234567890"
                  className="w-full bg-[#2C2518] border border-[rgba(201,168,76,0.2)] rounded-lg px-4 py-3 text-[#FAF6EE] placeholder-[#9E8A60] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div>
                <label className="block text-[#9E8A60] text-xs uppercase tracking-wider mb-1">
                  Correo (opcional)
                </label>
                <input
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  placeholder="tu@correo.com"
                  type="email"
                  className="w-full bg-[#2C2518] border border-[rgba(201,168,76,0.2)] rounded-lg px-4 py-3 text-[#FAF6EE] placeholder-[#9E8A60] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-900/20 border border-red-900/30 rounded-lg px-4 py-3">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPaso('instrucciones')}
                  className="flex-1 border border-[rgba(201,168,76,0.3)] text-[#9E8A60] hover:text-[#FAF6EE] font-semibold py-3 rounded-lg text-sm transition-colors"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="flex-1 bg-[#C9A84C] hover:bg-[#E8C97A] disabled:opacity-50 text-[#0E0C08] font-semibold py-3 rounded-lg text-sm transition-colors"
                >
                  {cargando ? 'Verificando...' : 'Obtener números'}
                </button>
              </div>
            </form>
          )}

          {/* Paso 3: Resultado */}
          {paso === 'resultado' && resultado && (
            <div className="space-y-5 text-center">
              <div>
                <p className="text-[#9E8A60] text-sm">Rifa: <span className="text-[#E8C97A]">{resultado.rifa_nombre}</span></p>
                <p className="text-[#9E8A60] text-sm mt-1">Premio: <span className="text-[#E8C97A]">{resultado.premio}</span></p>
              </div>

              <div>
                <p className="text-[#9E8A60] text-xs uppercase tracking-wider mb-4">
                  Tus {resultado.numeros.length} números asignados
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {resultado.numeros.map((n) => (
                    <div
                      key={n}
                      className="relative flex items-center justify-center"
                      style={{ width: '80px', height: '44px' }}
                    >
                      {/* Ticket shape: notches on left and right */}
                      <svg
                        viewBox="0 0 80 44"
                        className="absolute inset-0 w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient id={`gold-${n}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#F5D060" />
                            <stop offset="50%" stopColor="#D4920A" />
                            <stop offset="100%" stopColor="#B87C00" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M6,2 Q8,2 8,4 A6,6 0 0,1 8,40 Q8,42 6,42 L2,42 Q2,42 2,40 L2,4 Q2,2 4,2 Z
                             M74,2 Q76,2 78,2 L78,4 L78,40 Q78,42 76,42 L74,42 Q72,42 72,40 A6,6 0 0,1 72,4 Q72,2 74,2 Z
                             M8,2 L72,2 Q78,2 78,8 L78,36 Q78,42 72,42 L8,42 Q2,42 2,36 L2,8 Q2,2 8,2 Z"
                          fill={`url(#gold-${n})`}
                          stroke="#8B6000"
                          strokeWidth="1"
                        />
                        {/* Dashed center divider */}
                        <line x1="12" y1="22" x2="68" y2="22" stroke="#8B6000" strokeWidth="0.5" strokeDasharray="3,2" opacity="0.4" />
                      </svg>
                      <span className="relative z-10 font-mono font-black text-[#1a0c00] text-base tracking-wider">
                        {String(n).padStart(4, '0')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[#9E8A60] text-xs">
                Guarda estos números. También puedes consultarlos en{' '}
                <a href="/mis-numeros" className="text-[#C9A84C] underline">
                  Mis Números
                </a>{' '}
                con tu cédula.
              </p>

              <button
                onClick={onClose}
                className="w-full bg-[#C9A84C] hover:bg-[#E8C97A] text-[#0E0C08] font-semibold py-3 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
