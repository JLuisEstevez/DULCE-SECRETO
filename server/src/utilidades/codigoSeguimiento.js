export function generarCodigoSeguimiento() {
  const fecha = new Date()
  const sufijoFecha = `${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, '0')}${String(
    fecha.getDate()
  ).padStart(2, '0')}`
  const aleatorio = Math.random().toString(36).slice(2, 6).toUpperCase()

  return `DS-${sufijoFecha}-${aleatorio}`
}
