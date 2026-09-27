const ICONOS_POR_CATEGORIA = {
  Tortas: '🎂',
  'Postres Individuales': '🍮',
  Galletas: '🍪'
}

export function iconoDeCategoria(categoria) {
  return ICONOS_POR_CATEGORIA[categoria] ?? '🍰'
}
