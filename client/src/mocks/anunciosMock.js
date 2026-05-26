export const anunciosMock = [
  {
    _id: "mock_001",
    titulo: "Libro de Sistemas Informáticos - 1º DAW",
    descripcion: "Vendo libro oficial de la editorial Garceta en perfecto estado. Prácticamente sin subrayar. Ideal para el primer año.",
    precio: 25,
    categoria: "Libros",
    imagen: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
    creador: {
      nombre: "Sergio Test",
      email: "sergio@alu.edu.gva.es"
    },
    createdAt: "2026-05-19T10:00:00.000Z"
  },
  {
    _id: "mock_002",
    titulo: "Teclado Mecánico RGB",
    descripcion: "Cambio teclado mecánico con switches blue por uno más silencioso (red o brown). Va de lujo para programar en clase.",
    precio: 0, // 0 significará intercambio o gratis
    categoria: "Tecnología",
    imagen: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500",
    creador: {
      nombre: "Marta Profe",
      email: "marta@edu.gva.es"
    },
    createdAt: "2026-05-19T08:30:00.000Z"
  },
  {
    _id: "mock_003",
    titulo: "Apuntes resumidos de Entornos de Desarrollo",
    descripcion: "Comparto mis esquemas y resúmenes de Git, GitHub y diagramas de flujo para los exámenes finales.",
    precio: 0,
    categoria: "Apuntes",
    imagen: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500",
    creador: {
      nombre: "Alex DAW",
      email: "alex@alu.edu.gva.es"
    },
    createdAt: "2026-05-19T11:15:00.000Z"
  }
];