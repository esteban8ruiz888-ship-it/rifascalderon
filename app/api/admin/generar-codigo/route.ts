import { NextRequest, NextResponse } from 'next/server'
import { protegerAdmin } from '@/lib/admin-auth'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const guard = await protegerAdmin()
  if (guard) return guard

  const body = await req.json().catch(() => null)
  const { rifa_id, cantidad, combo } = body ?? {}

  if (!rifa_id || !cantidad || !combo) {
    return NextResponse.json({ error: 'Faltan campos: rifa_id, cantidad, combo' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { data: codigoData, error: codigoError } = await supabase.rpc('generar_codigo_unico')
  if (codigoError || !codigoData) {
    return NextResponse.json({ error: 'No se pudo generar el código' }, { status: 500 })
  }

  const { data, error } = await supabase
    .from('codigos_pago')
    .insert({
      rifa_id,
      codigo: codigoData,
      cantidad,
      combo,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Error al guardar el código' }, { status: 500 })
  }

  return NextResponse.json(data)
}
