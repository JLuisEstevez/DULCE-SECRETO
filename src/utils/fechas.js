const NOMBRES_DIA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const NOMBRES_MES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
]

export function aClaveFecha(fecha) {
  return fecha.toISOString().split('T')[0]
}

export function esMismoDia(a, b) {
  return aClaveFecha(a) === aClaveFecha(b)
}

export function nombreDiaCorto(fecha) {
  return NOMBRES_DIA[fecha.getDay()]
}

export function nombreMesAnio(fecha) {
  return `${NOMBRES_MES[fecha.getMonth()]} ${fecha.getFullYear()}`
}

// Lunes como inicio de semana.
export function inicioDeSemana(fecha) {
  const copia = new Date(fecha)
  const diaSemana = copia.getDay()
  const desplazamiento = diaSemana === 0 ? -6 : 1 - diaSemana
  copia.setDate(copia.getDate() + desplazamiento)
  copia.setHours(0, 0, 0, 0)
  return copia
}

export function diasDeSemana(fechaBase) {
  const inicio = inicioDeSemana(fechaBase)
  return Array.from({ length: 7 }, (_, indice) => {
    const dia = new Date(inicio)
    dia.setDate(inicio.getDate() + indice)
    return dia
  })
}

export function sumarSemanas(fecha, cantidad) {
  const copia = new Date(fecha)
  copia.setDate(copia.getDate() + cantidad * 7)
  return copia
}

export function sumarMeses(fecha, cantidad) {
  const copia = new Date(fecha)
  copia.setMonth(copia.getMonth() + cantidad)
  return copia
}

// Matriz de 6x7 días para la vista mensual (incluye días de relleno de meses vecinos).
export function matrizMensual(fechaBase) {
  const primerDiaMes = new Date(fechaBase.getFullYear(), fechaBase.getMonth(), 1)
  const inicioGrilla = inicioDeSemana(primerDiaMes)

  return Array.from({ length: 42 }, (_, indice) => {
    const dia = new Date(inicioGrilla)
    dia.setDate(inicioGrilla.getDate() + indice)
    return dia
  })
}
