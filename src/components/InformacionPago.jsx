import { useState } from 'react'
import { CUENTAS_PAGO } from '../data/pagos.js'

export default function InformacionPago() {
  const [copiado, setCopiado] = useState(null)

  async function copiar(numero, id) {
    try {
      await navigator.clipboard.writeText(numero)
      setCopiado(id)
      setTimeout(() => setCopiado(null), 1500)
    } catch {
      // Si el navegador bloquea el portapapeles, el número ya está visible para copiar a mano.
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {CUENTAS_PAGO.map((cuenta) => (
        <div key={cuenta.id} className="rounded-2xl border border-marron/15 bg-white/60 p-5">
          <div className="flex items-center justify-between">
            <span className="font-body text-sm font-semibold text-marron-oscuro">{cuenta.metodo}</span>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-marron/15 bg-crema-suave text-[10px] text-marron/50">
              QR
            </div>
          </div>
          <p className="mt-3 text-lg text-marron-oscuro">{cuenta.numero}</p>
          <p className="text-xs text-marron/50">A nombre de {cuenta.titular}</p>
          <button
            type="button"
            onClick={() => copiar(cuenta.numero, cuenta.id)}
            className="mt-3 text-xs font-medium text-marron/70 underline underline-offset-2 hover:text-marron-oscuro"
          >
            {copiado === cuenta.id ? 'Copiado ✓' : 'Copiar número'}
          </button>
          <p className="mt-2 text-xs text-marron/50">{cuenta.nota}</p>
        </div>
      ))}
    </div>
  )
}
