import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Bolsa() {
  const [items, setItems] = useState([])

  function cargarCarrito() {
    try {
      const guardados = localStorage.getItem('ds_carrito')
      setItems(guardados ? JSON.parse(guardados) : [])
    } catch {
      setItems([])
    }
  }

  useEffect(() => {
    cargarCarrito()
    window.addEventListener('ds_carrito_actualizado', cargarCarrito)
    return () => window.removeEventListener('ds_carrito_actualizado', cargarCarrito)
  }, [])

  function actualizarCantidad(id, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
      eliminarItem(id)
      return
    }
    const nuevos = items.map((i) => (i.id === id ? { ...i, cantidad: nuevaCantidad } : i))
    setItems(nuevos)
    localStorage.setItem('ds_carrito', JSON.stringify(nuevos))
  }

  function eliminarItem(id) {
    const nuevos = items.filter((i) => i.id !== id)
    setItems(nuevos)
    localStorage.setItem('ds_carrito', JSON.stringify(nuevos))
  }

  const totalPrecio = items.reduce(
    (acc, item) => acc + (item.precio_base || item.precio || 0) * item.cantidad,
    0
  )
  const totalUnidades = items.reduce((acc, item) => acc + item.cantidad, 0)

  if (items.length === 0) {
    return (
      <section className="contenedor flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <img src="/perfil.png" alt="Bolsa vacía" className="h-16 w-16 opacity-30" />
        <h1 className="mt-4 font-serif text-2xl text-marron">Tu bolsa está vacía</h1>
        <p className="mt-2 text-sm text-marron/60">
          Explora nuestras tortas y galletas artesanales para comenzar.
        </p>
        <Link to="/catalogo" className="btn-primario mt-6">
          Ir al Catálogo
        </Link>
      </section>
    )
  }

  return (
    <section className="contenedor py-12">
      <h1 className="font-serif text-3xl font-bold text-marron">Tu Bolsa de Compras</h1>
      <p className="mt-1 text-sm text-marron/60">
        Tienes {totalUnidades} {totalUnidades === 1 ? 'producto' : 'productos'} listos para ordenar.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-marron/10 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.imagen_url || '/perfil.png'}
                  alt={item.nombre}
                  className="h-16 w-16 rounded-xl object-cover bg-crema-suave"
                />
                <div>
                  <h3 className="font-semibold text-marron">{item.nombre}</h3>
                  <p className="text-xs text-marron/60">
                    ${(item.precio_base || item.precio || 0).toLocaleString('es-CO')} COP c/u
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-marron/20 bg-crema-suave/40">
                  <button
                    type="button"
                    onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                    className="px-2.5 py-1 text-sm font-bold text-marron hover:bg-rosa/30"
                  >
                    -
                  </button>
                  <span className="px-2 text-sm font-semibold text-marron">{item.cantidad}</span>
                  <button
                    type="button"
                    onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                    className="px-2.5 py-1 text-sm font-bold text-marron hover:bg-rosa/30"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => eliminarItem(item.id)}
                  className="text-xs font-semibold text-red-500 hover:text-red-700"
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-marron/10 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-marron">Resumen del Pedido</h2>
          
          <div className="mt-4 flex justify-between border-b border-marron/10 pb-3 text-sm text-marron/70">
            <span>Subtotal</span>
            <span className="font-semibold text-marron">
              ${totalPrecio.toLocaleString('es-CO')} COP
            </span>
          </div>

          <div className="mt-4 flex justify-between text-base font-bold text-marron">
            <span>Total</span>
            <span className="text-rosa-intenso">
              ${totalPrecio.toLocaleString('es-CO')} COP
            </span>
          </div>

          <Link
            to="/checkout"
            state={{ desdeBolsa: true, productosBolsa: items, totalBolsa: totalPrecio }}
            className="btn-primario mt-6 flex w-full items-center justify-center text-center"
          >
            Proceder al Pago
          </Link>
        </div>
      </div>
    </section>
  )
}