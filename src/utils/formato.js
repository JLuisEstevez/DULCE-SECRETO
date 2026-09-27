const formateador = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
})

export function formatearCOP(valor) {
  return formateador.format(valor)
}
