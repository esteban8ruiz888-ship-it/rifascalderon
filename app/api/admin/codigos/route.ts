import { NextResponse } from 'next/server'
import { protegerAdmin } from '@/lib/admin-auth'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  const guard = await protegerAdmin()
  if (guard) return guard

  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('codigos_pago')
    .select('id, codigo, cantidad, combo, usado, creado_en, compradores(nombre, telefono, cedula)')
    .order('creado_en', { ascending: false })
    .limit(20)

  if (error) {
    return NextResponse.json({ error: 'Error al obtener códigos' }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}
