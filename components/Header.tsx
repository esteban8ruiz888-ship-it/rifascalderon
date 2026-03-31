'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0E0C08]/95 backdrop-blur border-b border-[rgba(201,168,76,0.2)]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#C9A84C] font-bold text-xl tracking-wide">
            Rifas CR
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-[#9E8A60] hover:text-[#E8C97A] transition-colors text-sm"
          >
            Inicio
          </Link>
          <Link
            href="/mis-numeros"
            className="text-[#9E8A60] hover:text-[#E8C97A] transition-colors text-sm"
          >
            Mis Números
          </Link>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#C9A84C] hover:bg-[#E8C97A] text-[#0E0C08] font-semibold text-sm px-4 py-2 rounded transition-colors"
          >
            Participar
          </a>
        </nav>

        <button
          className="md:hidden text-[#C9A84C]"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuAbierto ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuAbierto && (
        <div className="md:hidden bg-[#1A1612] border-t border-[rgba(201,168,76,0.2)] px-4 py-4 flex flex-col gap-4">
          <Link
            href="/"
            className="text-[#9E8A60] hover:text-[#E8C97A] transition-colors"
            onClick={() => setMenuAbierto(false)}
          >
            Inicio
          </Link>
          <Link
            href="/mis-numeros"
            className="text-[#9E8A60] hover:text-[#E8C97A] transition-colors"
            onClick={() => setMenuAbierto(false)}
          >
            Mis Números
          </Link>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#C9A84C] text-[#0E0C08] font-semibold px-4 py-2 rounded text-center"
          >
            Participar
          </a>
        </div>
      )}
    </header>
  )
}
