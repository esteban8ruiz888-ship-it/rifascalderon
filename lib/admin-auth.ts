import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const COOKIE_NAME = 'rc_admin'
const SESSION_DURATION = 8 * 60 * 60 * 1000 // 8 horas en ms

export function crearSesionAdmin(): string {
  const payload = { exp: Date.now() + SESSION_DURATION }
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

export async function verificarAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const val = cookieStore.get(COOKIE_NAME)?.value
  if (!val) return false
  try {
    const { exp } = JSON.parse(Buffer.from(val, 'base64').toString())
    return Date.now() < exp
  } catch {
    return false
  }
}

export async function protegerAdmin(): Promise<NextResponse | null> {
  const cookieStore = await cookies()
  const val = cookieStore.get(COOKIE_NAME)?.value
  if (!val) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const { exp } = JSON.parse(Buffer.from(val, 'base64').toString())
    if (Date.now() >= exp) {
      return NextResponse.json({ error: 'Sesión expirada' }, { status: 401 })
    }
    return null
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
}

export { COOKIE_NAME }
