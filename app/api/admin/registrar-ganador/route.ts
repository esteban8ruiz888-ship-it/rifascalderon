import { NextRequest, NextResponse } from 'next/server'
import { protegerAdmin } from '@/lib/admin-auth'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const guard = await protegerAdmin()
  if (guard) return guard

  const body = await req.json().catch(() => null)
  if (!body?.rifa_id || !body?.resultado_loteria) {
    return NextResponse.json(
      { error: 'rifa_id y resultado_loteria son requeridos' },
      { status: 400 }
    )
  }

  const supabase = createServerClient()

  const { data, error } = await supabase.rpc('registrar_ganador', {
    p_rifa_id: body.rifa_id,
    p_resultado_loteria: String(body.resultado_loteria).padStart(4, '0'),
  })

  if (error) {
    return NextResponse.json({ error: 'No se pudo registrar el ganador' }, { status: 500 })
  }

  return NextResponse.json(data)
}
