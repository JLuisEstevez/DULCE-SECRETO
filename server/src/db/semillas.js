import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { db, contarFilas } from './conexion.js'
import { generarCodigoSeguimiento } from '../utilidades/codigoSeguimiento.js'

function fechaRelativa(offsetDias) {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + offsetDias)
  return fecha.toISOString().split('T')[0]
}

const PRODUCTOS = [
  // ==========================================
  // CATEGORÍA: TORTAS (Personalizables)
  // ==========================================
  { 
    id: 'torta-vainilla-clasica', 
    nombre: 'Torta de Vainilla Clásica', 
    categoria: 'Tortas', 
    precio_base: 85000, 
    descripcion: 'Bizcocho suave de vainilla con relleno a elección.', 
    imagen_url: '/tortavainilla.jpg', 
    personalizable: 1 
  },
  { 
    id: 'torta-chocolate-intenso', 
    nombre: 'Torta de Chocolate Intenso', 
    categoria: 'Tortas', 
    precio_base: 95000, 
    descripcion: 'Bizcocho húmedo de chocolate, ideal para cumpleaños.', 
    imagen_url: '/tortachocolate.jpg', 
    personalizable: 1 
  },
  { 
    id: 'torta-red-velvet', 
    nombre: 'Torta Red Velvet', 
    categoria: 'Tortas', 
    precio_base: 110000, 
    descripcion: 'Clásica red velvet con cobertura de queso crema.', 
    imagen_url: '/tortavelvet.jpg', 
    personalizable: 1 
  },
  { 
    id: 'torta-tres-leches-domo', 
    nombre: 'Torta 3 Leches Individual (Domo)', 
    categoria: 'Tortas', 
    precio_base: 82000, 
    descripcion: 'Bizcocho artesanal bañado en mezcla tres leches en domo individual.', 
    imagen_url: '/tresleches.jpg', 
    personalizable: 0 
  },

  // ==========================================
  // CATEGORÍA: POSTRES INDIVIDUALES
  // ==========================================
  { 
    id: 'cupcake-zanahoria', 
    nombre: 'Cupcake de Zanahoria', 
    categoria: 'Postres Individuales', 
    precio_base: 8500, 
    descripcion: 'Individual, con nuez y cobertura de queso crema.', 
    imagen_url: '/cupcakezanahoria.jpg', 
    personalizable: 0 
  },
  { 
    id: 'mousse-maracuya', 
    nombre: 'Mousse de Maracuyá', 
    categoria: 'Postres Individuales', 
    precio_base: 9500, 
    descripcion: 'Postre individual, fresco y suave, en vasito de vidrio.', 
    imagen_url: '/moussemaracuya.jpg', 
    personalizable: 0 
  },
  { 
    id: 'brownie-nutella', 
    nombre: 'Brownie con Nutella', 
    categoria: 'Postres Individuales', 
    precio_base: 9000, 
    descripcion: 'Brownie húmedo con centro de Nutella.', 
    imagen_url: '/brownienutella.jpg', 
    personalizable: 0 
  },
  { 
    id: 'carlota-limon-caja', 
    nombre: 'Carlota de Limón Individual (Caja x8)', 
    categoria: 'Postres Individuales', 
    precio_base: 10000, 
    descripcion: 'Postre frío de limón con capas de galleta en presentación individual.', 
    imagen_url: '/carlotalimon.jpg', 
    personalizable: 0 
  },
  { 
    id: 'flan-tradicional-horneado', 
    nombre: 'Flan Tradicional Horneado', 
    categoria: 'Postres Individuales', 
    precio_base: 55000, 
    descripcion: 'Flan clásico artesanal horneado con caramelo líquido.', 
    imagen_url: '/flantradicional.jpg', 
    personalizable: 0 
  },
  { 
    id: 'mini-flan-gourmet-caja', 
    nombre: 'Mini Flan Gourmet en Desechable (Caja)', 
    categoria: 'Postres Individuales', 
    precio_base: 3500, 
    descripcion: 'Porción individual de flan gourmet en envase desechable.', 
    imagen_url: '/miniflan.jpg', 
    personalizable: 0 
  },

  // ==========================================
  // CATEGORÍA: GALLETAS
  // ==========================================
  { 
    id: 'galletas-chips-chocolate', 
    nombre: 'Galletas Chips de Chocolate', 
    categoria: 'Galletas', 
    precio_base: 4500, 
    descripcion: 'Unidad. Masa artesanal horneada al momento.', 
    imagen_url: '/galletaschips.jpg', 
    personalizable: 0 
  },
  { 
    id: 'galletas-avena', 
    nombre: 'Galletas de Avena y Pasas', 
    categoria: 'Galletas', 
    precio_base: 4200, 
    descripcion: 'Unidad. Receta tradicional, sin conservantes.', 
    imagen_url: '/galletasavena.jpg', 
    personalizable: 0 
  },
  { 
    id: 'galletas-nueces', 
    nombre: 'Galletas de Nueces', 
    categoria: 'Galletas', 
    precio_base: 5000, 
    descripcion: 'Galletas crujientes con trozos de nuez seleccionada.', 
    imagen_url: '/galletasdenuez.jpg', 
    personalizable: 0 
  },
  { 
    id: 'galleta-ny-red-velvet', 
    nombre: 'Galleta NY (Red Velvet)', 
    categoria: 'Galletas', 
    precio_base: 6600, 
    descripcion: 'Galleta estilo NY artesanal sabor Red Velvet.', 
    imagen_url: '/redvelvet.jpg', 
    personalizable: 0 
  },
  { 
    id: 'galleta-ny-explosion-oreo', 
    nombre: 'Galleta NY (Oreo + Choc Blanco + Nutella)', 
    categoria: 'Galletas', 
    precio_base: 8100, 
    descripcion: 'Galleta con trozos de Oreo, chocolate blanco y centro de Nutella.', 
    imagen_url: '/explocionoreo.jpg', 
    personalizable: 0 
  },
  { 
    id: 'galleta-ny-triple-chocolate', 
    nombre: 'Galleta NY (Triple Chocolate)', 
    categoria: 'Galletas', 
    precio_base: 6600, 
    descripcion: 'Galleta estilo NY intensa con triple chocolate.', 
    imagen_url: '/triplechocolate.jpg', 
    personalizable: 0 
  },
  { 
    id: 'galleta-ny-pistacho-gourmet', 
    nombre: 'Galleta NY (Pistacho Gourmet)', 
    categoria: 'Galletas', 
    precio_base: 11600, 
    descripcion: 'Galleta estilo NY con pistacho seleccionado de alta gama.', 
    imagen_url: '/pistacho.jpg', 
    personalizable: 0 
  },
  { 
    id: 'galleta-ny-bocadillo', 
    nombre: 'Galleta NY (Bocadillo Artesanal)', 
    categoria: 'Galletas', 
    precio_base: 6000, 
    descripcion: 'Galleta estilo NY con relleno tradicional de bocadillo colombiano.', 
    imagen_url: '/bocadillo.jpg', 
    personalizable: 0 
  },

  { id: 'galleta-mantequilla-chocolate', 
    nombre: 'Galleta de Mantequilla y Chocolate', 
    categoria: 'Galletas', 
    precio_base: 5000, descripcion: 'Galleta artesanal de mantequilla con trozos de chocolate puro.', 
    imagen_url: "/galletasmantechoco.jpg", 
    personalizable: 0 
  },

  // ==========================================
  // CATEGORÍA: MINI-DONAS (Opcional)
  // ==========================================
  { 
    id: 'mini-donas-vainilla-lote', 
    nombre: 'Mini-donas Vainilla (Lote Base)', 
    categoria: 'Postres Individuales', 
    precio_base: 500, 
    descripcion: 'Unidad de mini-dona sabor vainilla horneada en máquina donera.', 
    imagen_url: '/minidonavainilla.jpg', 
    personalizable: 0 
  },
  { 
    id: 'mini-donas-chocolate-lote', 
    nombre: 'Mini-donas Chocolate (Lote Grande)', 
    categoria: 'Postres Individuales', 
    precio_base: 500, 
    descripcion: 'Unidad de mini-dona sabor chocolate suave.', 
    imagen_url: '/minidonachocolate.jpg', 
    personalizable: 0 
  }
];

const OPCIONES = [
  { id: 'p10', tipo: 'porcion', nombre: '10 porciones', costo_adicional: 0, factor: 1 },
  { id: 'p20', tipo: 'porcion', nombre: '20 porciones', costo_adicional: 0, factor: 1.8 },
  { id: 'p30', tipo: 'porcion', nombre: '30 porciones', costo_adicional: 0, factor: 2.5 },

  { id: 'sabor-vainilla', tipo: 'sabor', nombre: 'Vainilla', costo_adicional: 0, factor: null },
  { id: 'sabor-chocolate', tipo: 'sabor', nombre: 'Chocolate', costo_adicional: 0, factor: null },
  { id: 'sabor-red-velvet', tipo: 'sabor', nombre: 'Red Velvet', costo_adicional: 8000, factor: null },
  { id: 'sabor-zanahoria', tipo: 'sabor', nombre: 'Zanahoria', costo_adicional: 5000, factor: null },

  { id: 'relleno-arequipe', tipo: 'relleno', nombre: 'Arequipe', costo_adicional: 0, factor: null },
  { id: 'relleno-frutos-rojos', tipo: 'relleno', nombre: 'Frutos Rojos', costo_adicional: 6000, factor: null },
  { id: 'relleno-nutella', tipo: 'relleno', nombre: 'Nutella', costo_adicional: 10000, factor: null },
  { id: 'relleno-maracuya', tipo: 'relleno', nombre: 'Maracuyá', costo_adicional: 6000, factor: null },

  { id: 'topping-frutas-frescas', tipo: 'topping', nombre: 'Frutas frescas', costo_adicional: 7000, factor: null },
  { id: 'topping-chocolate-derretido', tipo: 'topping', nombre: 'Chocolate derretido', costo_adicional: 5000, factor: null },
  { id: 'topping-perlas-azucar', tipo: 'topping', nombre: 'Perlas de azúcar', costo_adicional: 4000, factor: null },
  { id: 'topping-flores-comestibles', tipo: 'topping', nombre: 'Flores comestibles', costo_adicional: 9000, factor: null }
]

function pedidosDeEjemplo() {
  return [
    {
      cliente_nombre: 'Laura Gómez',
      telefono: '3001234567',
      direccion: 'Cra 45 #12-30, El Poblado',
      fecha_entrega: fechaRelativa(0),
      notas: null,
      producto_resumen: 'Torta Red Velvet · 20 porciones',
      total: 205000,
      estado_pedido: 'Horneando',
      estado_pago: 'Aprobado'
    },
    {
      cliente_nombre: 'Andrés Muñoz',
      telefono: '3109876543',
      direccion: 'Retiro en local',
      fecha_entrega: fechaRelativa(0),
      notas: null,
      producto_resumen: 'Cupcake de Zanahoria · 12 unidades',
      total: 102000,
      estado_pedido: 'Por Validar',
      estado_pago: 'Pendiente'
    },
    {
      cliente_nombre: 'Camila Restrepo',
      telefono: '3201112233',
      direccion: 'Cl 10 #43-12, Envigado',
      fecha_entrega: fechaRelativa(1),
      notas: 'Sin nueces por alergia',
      producto_resumen: 'Torta de Chocolate Intenso · 10 porciones',
      total: 118000,
      estado_pedido: 'En Preparación',
      estado_pago: 'Aprobado'
    },
    {
      cliente_nombre: 'Juan Pablo Ríos',
      telefono: '3157778899',
      direccion: 'Cra 70 #5-20, Laureles',
      fecha_entrega: fechaRelativa(2),
      notas: null,
      producto_resumen: 'Torta de Vainilla Clásica · 30 porciones',
      total: 245500,
      estado_pedido: 'Por Validar',
      estado_pago: 'Pendiente'
    },
    {
      cliente_nombre: 'Valentina Osorio',
      telefono: '3012223344',
      direccion: 'Retiro en local',
      fecha_entrega: fechaRelativa(3),
      notas: null,
      producto_resumen: 'Galletas Chips de Chocolate · 24 unidades',
      total: 108000,
      estado_pedido: 'Por Validar',
      estado_pago: 'Rechazado'
    }
  ]
}

export function ejecutarSemillas() {
  const insertarProducto = db.prepare(`
    INSERT INTO productos (id, nombre, categoria, precio_base, descripcion, imagen_url, personalizable)
    VALUES (@id, @nombre, @categoria, @precio_base, @descripcion, @imagen_url, @personalizable)
  `)
  const insertarOpcion = db.prepare(`
    INSERT INTO opciones_personalizacion (id, tipo, nombre, costo_adicional, factor)
    VALUES (@id, @tipo, @nombre, @costo_adicional, @factor)
  `)
  const insertarPedido = db.prepare(`
    INSERT INTO pedidos (
      id, codigo_seguimiento, cliente_nombre, telefono, direccion, fecha_entrega,
      notas, producto_resumen, total, estado_pedido, estado_pago, comprobante_url
    ) VALUES (
      @id, @codigo_seguimiento, @cliente_nombre, @telefono, @direccion, @fecha_entrega,
      @notas, @producto_resumen, @total, @estado_pedido, @estado_pago, @comprobante_url
    )
  `)
  const insertarUsuarioAdmin = db.prepare(`
    INSERT INTO usuarios_admin (nombre, email, password_hash, rol)
    VALUES (@nombre, @email, @password_hash, @rol)
  `)

  const insertarTodo = db.transaction(() => {
    if (contarFilas('productos') === 0) {
      for (const producto of PRODUCTOS) insertarProducto.run(producto)
    }

    if (contarFilas('opciones_personalizacion') === 0) {
      for (const opcion of OPCIONES) insertarOpcion.run(opcion)
    }

    if (contarFilas('pedidos') === 0) {
      for (const pedido of pedidosDeEjemplo()) {
        insertarPedido.run({
          id: randomUUID(),
          codigo_seguimiento: generarCodigoSeguimiento(),
          comprobante_url: null,
          ...pedido
        })
      }
    }

    if (contarFilas('usuarios_admin') === 0) {
      const emailInicial = process.env.ADMIN_EMAIL_INICIAL || 'kelly@dulcesecreto.co'
      const passwordInicial = process.env.ADMIN_PASSWORD_INICIAL || 'dulcesecreto123'

      insertarUsuarioAdmin.run({
        nombre: 'Kelly Estévez',
        email: emailInicial.trim().toLowerCase(),
        password_hash: bcrypt.hashSync(passwordInicial, 10),
        rol: 'admin'
      })

      console.log('—'.repeat(56))
      console.log('Cuenta administrativa creada. Usa estos datos para entrar a /login:')
      console.log(`  Correo:      ${emailInicial}`)
      console.log(`  Contraseña:  ${passwordInicial}`)
      console.log('Cámbiala luego desde "Mi perfil" en el panel administrativo.')
      console.log('—'.repeat(56))
    }
  })

  insertarTodo()
}
