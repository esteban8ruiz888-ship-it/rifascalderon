import { NextRequest, NextResponse } from 'next/server'
import { protegerAdmin } from '@/lib/admin-auth'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const guard = await protegerAdmin()
  if (guard) return guard

  const body = await req.json().catch(() => null)
  const { id, nombre, premio, total_numeros } = body ?? {}

  if (!nombre || !premio || !total_numeros) {
    return NextResponse.json({ error: 'Faltan campos: nombre, premio, total_numeros' }, { status: 400 })
  }

  const supabase = createServerClient()

  if (id) {
    // Editar rifa existente
    const { data, error } = await supabase
      .from('rifas')
      .update({ nombre, premio, total_puestos: Number(total_numeros) })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error al actualizar rifa:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
  } else {
    // Crear rifa nueva
    const { data, error } = await supabase
      .from('rifas')
      .insert({ nombre, premio, total_puestos: Number(total_numeros), estado: 'activa' })
      .select()
      .single()

    if (error) {
      console.error('Error al crear rifa:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
  }
}
