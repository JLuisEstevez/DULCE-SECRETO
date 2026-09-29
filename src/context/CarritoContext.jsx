import { createContext, useContext, useEffect, useState } from 'react'

const CarritoContext = createContext()

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const guardados = localStorage.getItem('ds_carrito')
      return guardados ? JSON.parse(guardados) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('ds_carrito', JSON.stringify(items))
  }, [items])

  function agregarItem(producto) {
    setItems((actuales) => {
      const indice = actuales.findIndex((i) => i.id === producto.id)
      if (indice >= 0) {
        const copia = [...actuales]
        copia[indice].cantidad += 1
        return copia
      }
      return [...actuales, { ...producto, cantidad: 1 }]
    })
  }

  function eliminarItem(id) {
    setItems((actuales) => actuales.filter((i) => i.id !== id))
  }

  function actualizarCantidad(id, cantidad) {
    if (cantidad <= 0) {
      eliminarItem(id)
      return
    }
    setItems((actuales) =>
      actuales.map((i) => (i.id === id ? { ...i, cantidad } : i))
    )
  }

  function vaciarCarrito() {
    setItems([])
  }

  const totalUnidades = items.reduce((acc, item) => acc + item.cantidad, 0)
  const totalPrecio = items.reduce((acc, item) => acc + (item.precio_base || item.precio || 0) * item.cantidad, 0)

  return (
    <CarritoContext.Provider
      value={{
        items,
        agregarItem,
        eliminarItem,
        actualizarCantidad,
        vaciarCarrito,
        totalUnidades,
        totalPrecio
      }}
    >
      {children}
    </CarritoContext.Provider>
  )
}

export function useCarrito() {
  const context = useContext(CarritoContext)
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de un CarritoProvider')
  }
  return context
}