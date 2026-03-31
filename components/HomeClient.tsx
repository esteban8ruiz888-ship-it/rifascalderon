'use client'

import { useState } from 'react'
import ModalCompra from './ModalCompra'

interface Props {
  rifaNombre: string
  whatsappNumber: string
  nequiNumber: string
}

export default function HomeClient({ rifaNombre, whatsappNumber, nequiNumber }: Props) {
  const [modalAbierto, setModalAbierto] = useState(false)

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            `Hola, quiero participar en la rifa "${rifaNombre}". ¿Cómo realizo el pago?`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold py-4 px-8 rounded-xl text-lg text-center transition-colors shadow-lg shadow-[#25D366]/20"
        >
          Pagar por WhatsApp
        </a>
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-gradient-to-r from-[#C9A84C] to-[#E8C97A] hover:from-[#E8C97A] hover:to-[#C9A84C] text-[#0E0C08] font-bold py-4 px-8 rounded-xl text-lg transition-all shadow-lg shadow-[#C9A84C]/20"
        >
          Ya tengo un código
        </button>
      </div>

      {modalAbierto && (
        <ModalCompra
          rifaNombre={rifaNombre}
          whatsappNumber={whatsappNumber}
          nequiNumber={nequiNumber}
          onClose={() => setModalAbierto(false)}
        />
      )}
    </>
  )
}
