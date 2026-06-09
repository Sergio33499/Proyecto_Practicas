import React, { useState, useEffect } from 'react';

export default function Home({ user, onLogout }) {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para los campos del formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('MATERIAL');
  const [modalidad, setModalidad] = useState('OFREZCO');
  const [enviando, setEnviando] = useState(false);

  // ESTADO PARA EL FILTRO DE ANUNCIOS
  const [filtro, setFiltro] = useState('TODOS'); // Puede ser: 'TODOS', 'MATERIAL', 'CONOCIMIENTO'

  // NUEVOS ESTADOS PARA LA EDICIÓN
  const [editandoId, setEditandoId] = useState(null);

  // Función para cargar los anuncios de la base de datos
  const obtenerAnuncios = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/posts`);
      if (!response.ok) throw new Error('No se pudieron cargar los anuncios');
      const data = await response.json();
      setAnuncios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerAnuncios();
  }, []);

  // Función para conectar con la ruta DELETE del backend para borrar el anuncio
  const manejarBorrar = async (idAnuncio) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este anuncio de forma permanente? 🗑️');
    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

      const response = await fetch(`${baseUrl}/api/posts/${idAnuncio}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'No se pudo eliminar el anuncio');

      alert('¡Anuncio eliminado correctamente!');
      
      if (editandoId === idAnuncio) {
        cancelarEdicion();
      }

      setAnuncios(anuncios.filter(anuncio => anuncio._id !== idAnuncio));
    } catch (err) {
      alert(err.message);
    }
  };

  // Función para cargar los datos de una tarjeta en el formulario para editar
  const cargarFormularioParaEditar = (anuncio) => {
    setEditandoId(anuncio._id);
    setTitulo(anuncio.titulo);
    setDescripcion(anuncio.descripcion);
    setTipo(anuncio.tipo);
    setModalidad(anuncio.modalidad);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para limpiar el formulario y cancelar la edición
  const cancelarEdicion = () => {
    setEditandoId(null);
    setTitulo('');
    setDescripcion('');
    setTipo('MATERIAL');
    setModalidad('OFREZCO');
  };

  // Función unificada para Guardar (Crear o Editar)
  const manejarFormulario = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

      const url = editandoId ? `${baseUrl}/api/posts/${editandoId}` : `${baseUrl}/api/posts`;
      const method = editandoId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ titulo, descripcion, tipo, modalidad })
      });

      if (!response.ok) throw new Error(editandoId ? 'Error al modificar el anuncio' : 'Error al publicar el anuncio');

      cancelarEdicion();
      obtenerAnuncios();
    } catch (err) {
      alert(err.message);
    } finally {
      setEnviando(false);
    }
  };

  // FILTRADO LÓGICO DE ANUNCIOS ANTES DE PINTARLOS
  const anunciosFiltrados = anuncios.filter(anuncio => {
    if (filtro === 'TODOS') return true;
    return anuncio.tipo === filtro;
  });

  return (
    <div className="dashboard-container p-6 bg-gray-50 min-h-screen">
      {/* CABECERA */}
      <header className="dashboard-header flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">IEShare Betxí - Tablón de Anuncios 🚀</h1>
          <p className="text-sm text-gray-600">
            Hola, <strong className="text-green-600">{user.nombre}</strong> • Conectado como <strong>{user.email}</strong>
          </p>
        </div>
        <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors">
          Cerrar Sesión
        </button>
      </header>

      {/* FORMULARIO INTELIGENTE DE NUEVO / EDITAR ANUNCIO */}
      <div className={`p-6 rounded-xl shadow-sm border mb-8 max-w-2xl mx-auto transition-colors ${editandoId ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            {editandoId ? '✏️ Editar tu anuncio existente' : '📢 Publicar un nuevo anuncio'}
          </h2>
          {editandoId && (
            <button type="button" onClick={cancelarEdicion} className="text-xs text-amber-700 hover:underline font-medium">
              ❌ Cancelar edición (Crear nuevo)
            </button>
          )}
        </div>
        <form onSubmit={manejarFormulario} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título del anuncio</label>
            <input 
              type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Libro de Sistemas Informáticos - 1º DAW"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción detallada</label>
            <textarea 
              required value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe el estado del material o qué ayuda ofreces/buscas..."
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 h-20 bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="MATERIAL">Material (Market)</option>
                <option value="CONOCIMIENTO">Conocimiento (Skill-Sharing)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">¿Qué necesitas?</label>
              <select value={modalidad} onChange={(e) => setModalidad(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="OFREZCO">Ofrezco</option>
                <option value="BUSCO">Busco</option>
              </select>
            </div>
          </div>
          <button 
            type="submit" disabled={enviando}
            className={`w-full text-white font-medium py-2 rounded-md transition-colors text-sm disabled:bg-gray-400 ${editandoId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {enviando ? 'Guardando...' : editandoId ? 'Guardar Cambios' : 'Publicar Anuncio'}
          </button>
        </form>
      </div>

      <hr className="border-gray-200 my-8" />

      {/* NUEVO: BOTONES VISUALES PARA FILTRAR EL TABLÓN */}
      <div className="flex justify-center items-center gap-2 mb-6">
        <span className="text-sm font-medium text-gray-500 mr-2">Filtrar por:</span>
        <button 
          onClick={() => setFiltro('TODOS')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${filtro === 'TODOS' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
        >
          👀 Ver Todo
        </button>
        <button 
          onClick={() => setFiltro('MATERIAL')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${filtro === 'MATERIAL' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
        >
          📦 Material
        </button>
        <button 
          onClick={() => setFiltro('CONOCIMIENTO')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${filtro === 'CONOCIMIENTO' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
        >
          🧠 Conocimiento
        </button>
      </div>

      {/* LISTADO DE ANUNCIOS FILTRADOS */}
      {loading && <div className="text-center py-10 font-medium text-gray-600">Cargando el tablón...</div>}
      {error && <div className="text-center py-10 text-red-600 font-medium">❌ Error: {error}</div>}

      {!loading && !error && anunciosFiltrados.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto">
          <p className="text-lg font-semibold text-gray-700">No hay anuncios aquí sueltos 📭</p>
          <p className="text-gray-500 mt-1 text-xs">No hay publicaciones activas para la categoría seleccionada.</p>
        </div>
      )}

      {!loading && !error && anunciosFiltrados.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {anunciosFiltrados.map((anuncio) => {
            const esMio = anuncio.autor?._id === user.id || anuncio.autor === user.id;

            return (
              <div key={anuncio._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="p-4">
                  <div className="flex gap-2 mb-2">
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold uppercase">{anuncio.tipo}</span>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold uppercase">{anuncio.modalidad}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{anuncio.titulo}</h3>
                  <p className="text-gray-600 text-sm mb-4">{anuncio.descripcion}</p>
                  <hr className="border-gray-100 my-3" />
                  <div className="text-xs text-gray-500">
                    <p>👤 <strong>Publicado por:</strong> {anuncio.autor?.nombre || 'Usuario'}</p>
                    <p className="text-gray-400 mt-0.5">📧 {anuncio.autor?.email}</p>
                  </div>
                </div>

                {/* SECCIÓN DE BOTONES INFERIORES */}
                <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                  {esMio ? (
                    <>
                      {/* Si el anuncio es mío: Puedo Editar y Borrar */}
                      <button 
                        onClick={() => cargarFormularioParaEditar(anuncio)}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold px-3 py-1.5 rounded transition-colors"
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        onClick={() => manejarBorrar(anuncio._id)}
                        className="bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold px-3 py-1.5 rounded transition-colors"
                      >
                        🗑️ Borrar
                      </button>
                    </>
                  ) : (
                    /* NUEVO: Si el anuncio NO es mío, sale el botón de Contactar por correo (mailto:) */
                    <a 
                      href={`mailto:${anuncio.autor?.email || ''}?subject=[IEShare Betxí] Me interesa tu anuncio: ${encodeURIComponent(anuncio.titulo)}`}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-1.5 rounded shadow-sm transition-colors flex items-center gap-1"
                    >
                      ✉️ Contactar por Email
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}