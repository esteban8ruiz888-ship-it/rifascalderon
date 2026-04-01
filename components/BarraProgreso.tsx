'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  rifaId: string
  totalNumeros: number
  numerosVendidosInicial: number
}

export default function BarraProgreso({ rifaId, totalNumeros, numerosVendidosInicial }: Props) {
  const [vendidos, setVendidos] = useState(numerosVendidosInicial)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`rifa-progreso-${rifaId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rifas',
          filter: `id=eq.${rifaId}`,
        },
        (payload) => {
          const nuevosVendidos = payload.new?.puestos_vendidos
          if (typeof nuevosVendidos === 'number') {
            setVendidos(nuevosVendidos)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [rifaId])

  const porcentaje = totalNumeros > 0 ? Math.min((vendidos / totalNumeros) * 100, 100) : 0
  const disponibles = totalNumeros - vendidos

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-3">
        <div className="text-center">
          <p className="text-[#E8C97A] font-bold text-xl">{vendidos.toLocaleString('es-CO')}</p>
          <p className="text-[#9E8A60] text-xs uppercase tracking-wide">vendidos</p>
        </div>
        <div className="text-center">
          <p className="text-[#C9A84C] font-black text-2xl">{porcentaje.toFixed(1)}%</p>
          <p className="text-[#9E8A60] text-xs uppercase tracking-wide">vendido</p>
        </div>
        <div className="text-center">
          <p className="text-[#E8C97A] font-bold text-xl">{disponibles.toLocaleString('es-CO')}</p>
          <p className="text-[#9E8A60] text-xs uppercase tracking-wide">disponibles</p>
        </div>
      </div>
      <div className="w-full h-5 bg-[#2C2518] rounded-full overflow-hidden border border-[#C9A84C]/20 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-[#C9A84C] via-[#E8C97A] to-[#C9A84C] rounded-full transition-all duration-700 shadow-lg shadow-[#C9A84C]/30"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <p className="text-center text-xs text-[#9E8A60] mt-2">
        ¡Compra que se van volando!
      </p>
    </div>
  )
}
