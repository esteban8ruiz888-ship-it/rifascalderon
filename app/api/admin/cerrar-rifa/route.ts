import { NextRequest, NextResponse } from 'next/server'
import { protegerAdmin } from '@/lib/admin-auth'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const guard = await protegerAdmin()
  if (guard) return guard

  const body = await req.json().catch(() => null)
  if (!body?.rifa_id) {
    return NextResponse.json({ error: 'rifa_id requerido' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { error } = await supabase.rpc('cerrar_rifa', { p_rifa_id: body.rifa_id })
  if (error) {
    return NextResponse.json({ error: 'No se pudo cerrar la rifa' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
