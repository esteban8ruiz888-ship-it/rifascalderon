import { NextRequest, NextResponse } from 'next/server'
import { protegerAdmin } from '@/lib/admin-auth'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const guard = await protegerAdmin()
  if (guard) return guard

  const body = await req.json().catch(() => null)
  const { rifa_id, combo, valor } = body ?? {}

  if (!rifa_id || !combo || !valor) {
    return NextResponse.json({ error: 'Faltan campos: rifa_id, combo, valor' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { data: codigoData, error: codigoError } = await supabase.rpc('generar_codigo_unico')
  if (codigoError || !codigoData) {
    console.error('Error generando código único:', codigoError)
    return NextResponse.json({ error: codigoError?.message ?? 'No se pudo generar el código' }, { status: 500 })
  }

  const { data, error } = await supabase
    .from('codigos_pago')
    .insert({
      rifa_id,
      codigo: codigoData,
      combo,
      valor,
    })
    .select()
    .single()

  if (error) {
    console.error('Error guardando código:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
