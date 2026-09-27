import { Link } from 'react-router-dom'

export default function Inicio() {
  return (
    <div className="flex flex-col gap-12">
      {/* Sección Hero / Bienvenida Principal */}
      <section className="contenedor py-12 text-center md:py-20">
        <span className="font-serif text-sm font-semibold uppercase tracking-widest text-rosa-intenso">
          Repostería Artesanal & Cocina Oculta
        </span>
        <h1 className="mx-auto mt-4 max-w-3xl font-serif text-4xl font-bold tracking-tight text-marron sm:text-5xl md:text-6xl">
          El arte de endulzar tus momentos especiales.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-marron/75 sm:text-lg">
          Tortas de diseño, postres individuales y galletas artesanales bajo encargo en Barranquilla.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/catalogo"
            className="rounded-full bg-marron px-8 py-3.5 text-sm font-semibold text-crema-suave shadow-md transition-all hover:bg-marron/90 hover:shadow-lg"
          >
            Ver Catálogo
          </Link>
          <Link
            to="/personalizar"
            className="rounded-full border border-marron/20 bg-white px-8 py-3.5 text-sm font-semibold text-marron transition-all hover:border-marron/50"
          >
            Personalizar Torta
          </Link>
        </div>
      </section>

      {/* Sección de los 3 Pilares — Experiencia Dulce Secreto */}
      <section className="contenedor pb-16">
        <header className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-marron sm:text-4xl">
            Vive la Experiencia <span className="italic text-rosa-intenso">Dulce Secreto</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-marron/70 sm:text-base">
            Repostería de autor horneada exclusivamente bajo pedido con ingredientes reales y detalles pensados para sorprender.
          </p>
        </header>

        {/* Grilla de 3 Tarjetas */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          
          {/* Tarjeta 1: Personalizador */}
          <article className="flex flex-col overflow-hidden rounded-2xl border border-marron/10 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="aspect-[16/9] w-full overflow-hidden bg-marron/5">
              <img 
                src="/tortavainilla.jpg" 
                alt="Personaliza tu Torta" 
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-marron">
                  Personaliza tu Torta
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-marron/70">
                  Elige en tiempo real porciones, bizcochos, rellenos de autor y decoraciones personalizadas antes de ordenar.
                </p>
              </div>
              <div className="mt-6">
                <Link 
                  to="/personalizar" 
                  className="inline-block w-full rounded-full bg-rosa/30 py-2.5 text-center text-sm font-semibold text-marron transition-colors hover:bg-rosa-intenso hover:text-white"
                >
                  Diseñar mi torta
                </Link>
              </div>
            </div>
          </article>

          {/* Tarjeta 2: El Secreto VIP */}
          <article className="flex flex-col overflow-hidden rounded-2xl border border-marron/10 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="aspect-[16/9] w-full overflow-hidden bg-marron/5">
              <img 
                src="/explocionoreo.jpg" 
                alt="El Secreto VIP" 
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-marron">
                  El Detalle "Secreto VIP"
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-marron/70">
                  Por compras desde $50.000 COP recibe un obsequio sorpresa exclusivo de nuestra nueva línea de galletas artesanales.
                </p>
              </div>
              <div className="mt-6">
                <Link 
                  to="/catalogo" 
                  className="inline-block w-full rounded-full bg-rosa/30 py-2.5 text-center text-sm font-semibold text-marron transition-colors hover:bg-rosa-intenso hover:text-white"
                >
                  Explorar catálogo
                </Link>
              </div>
            </div>
          </article>

          {/* Tarjeta 3: Horneado Fresco y Anticipación */}
          <article className="flex flex-col overflow-hidden rounded-2xl border border-marron/10 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="aspect-[16/9] w-full overflow-hidden bg-marron/5">
              <img 
                src="/galletasdenuez.jpg" 
                alt="Horneado Fresco bajo Pedido" 
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-marron">
                  Horneado con 48h de Anticipación
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-marron/70">
                  Sin stock envejecido. Horneamos el mismo día de tu entrega para garantizar máxima frescura y textura artesanal.
                </p>
              </div>
              <div className="mt-6">
                <a 
                  href="https://wa.me/573105357830?text=Hola,%20quisiera%20consultar%20disponibilidad%20para%20un%20pedido%20programado" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-block w-full rounded-full bg-emerald-500 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                >
                  Consultar agenda
                </a>
              </div>
            </div>
          </article>

        </div>
      </section>
    </div>
  )
}