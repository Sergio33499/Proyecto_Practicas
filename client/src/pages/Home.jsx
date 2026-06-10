import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast'; 
import AnuncioCard from '../components/AnuncioCard';
import AnuncioFormModal from '../components/AnuncioFormModal';
import ConfirmBorrarModal from '../components/ConfirmBorrarModal';
import AnuncioSkeleton from '../components/AnuncioSkeleton'; // IMPORTAMOS EL SKELETON

export default function Home({ user, onLogout }) {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados del formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('MATERIAL');
  const [modalidad, setModalidad] = useState('OFREZCO');
  const [enviando, setEnviando] = useState(false);

  // Estados de filtrado combinado
  const [filtroCategoria, setFiltroCategoria] = useState('TODOS'); 
  const [filtroModalidad, setFiltroModalidad] = useState('TODOS'); 

  // Estados de edición, favoritos y modales
  const [editandoId, setEditandoId] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [modalBorrarOpen, setModalBorrarOpen] = useState(false);
  const [idAnuncioABorrar, setIdAnuncioABorrar] = useState(null);
  const [modalFormOpen, setModalFormOpen] = useState(false);

  const obtenerAnuncios = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/posts`);
      if (!response.ok) throw new Error('No se pudieron cargar los anuncios');
      const data = await response.json();
      setAnuncios(data);
    } catch (err) {
      setError(err.message);
      toast.error('Error al conectar con el servidor 📡');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerAnuncios();
    setFavoritos(JSON.parse(localStorage.getItem('ieshare_favoritos')) || []);
  }, []);

  const manejarToggleFavorito = (idAnuncio) => {
    const nuevosFavs = favoritos.includes(idAnuncio) ? favoritos.filter(id => id !== idAnuncio) : [...favoritos, idAnuncio];
    setFavoritos(nuevosFavs);
    localStorage.setItem('ieshare_favoritos', JSON.stringify(nuevosFavs));
    toast.success(favoritos.includes(idAnuncio) ? 'Eliminado de favoritos' : '¡Añadido a favoritos! ❤️');
  };

  const abrirFormularioCrear = () => {
    setEditandoId(null); setTitulo(''); setDescripcion(''); setTipo('MATERIAL'); setModalidad('OFREZCO');
    setModalFormOpen(true);
  };

  const cargarFormularioParaEditar = (anuncio) => {
    setEditandoId(anuncio._id); setTitulo(anuncio.titulo); setDescripcion(anuncio.descripcion); setTipo(anuncio.tipo); setModalidad(anuncio.modalidad);
    setModalFormOpen(true);
  };

  const cerrarFormulario = () => { setModalFormOpen(false); setEditandoId(null); };

  const ejecutarBorradoReal = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/posts/${idAnuncioABorrar}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error('No se pudo eliminar el anuncio');
      toast.success('¡Anuncio eliminado! 🗑️');
      setAnuncios(anuncios.filter(a => a._id !== idAnuncioABorrar));
      setFavoritos(favoritos.filter(id => id !== idAnuncioABorrar));
    } catch (err) { toast.error(err.message); }
    finally { setModalBorrarOpen(false); }
  };

  const manejarFormulario = async (e) => {
    e.preventDefault(); setEnviando(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const url = editandoId ? `${baseUrl}/api/posts/${editandoId}` : `${baseUrl}/api/posts`;
      const response = await fetch(url, {
        method: editandoId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ titulo, descripcion, tipo, modalidad })
      });
      if (!response.ok) throw new Error('Error en el servidor');
      toast.success(editandoId ? '¡Anuncio actualizado! ✨' : '¡Anuncio publicado! 📢');
      cerrarFormulario(); obtenerAnuncios();
    } catch (err) { toast.error(err.message); }
    finally { setEnviando(false); }
  };

  const anunciosFiltrados = anuncios.filter(anuncio => {
    const cumpleCategoria = filtroCategoria === 'TODOS' || anuncio.tipo === filtroCategoria;
    const cumpleModalidad = filtroModalidad === 'TODOS' || anuncio.modalidad === filtroModalidad;
    return cumpleCategoria && cumpleModalidad;
  });

  return (
    <div className="dashboard-container p-6 bg-gray-50 min-h-screen">
      {/* CABECERA */}
      <header className="dashboard-header flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">IEShare Betxí 🚀</h1>
          <p className="text-sm text-gray-600">Hola, <strong className="text-green-600">{user.nombre}</strong></p>
        </div>
        <div className="flex gap-2">
          <button onClick={abrirFormularioCrear} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium text-sm shadow-sm">➕ Publicar Anuncio</button>
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium text-sm">Cerrar Sesión</button>
        </div>
      </header>

      {/* SECCIÓN DE FILTROS COMBINADOS */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col lg:flex-row justify-between items-center gap-4">
        
        {/* BLOQUE 1: CATEGORÍA */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categoría:</span>
          <button onClick={() => setFiltroCategoria('TODOS')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filtroCategoria === 'TODOS' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 border'}`}>👀 Todas</button>
          <button onClick={() => setFiltroCategoria('MATERIAL')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filtroCategoria === 'MATERIAL' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 border border-green-200'}`}>📦 Material</button>
          <button onClick={() => setFiltroCategoria('CONOCIMIENTO')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filtroCategoria === 'CONOCIMIENTO' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>🧠 Conocimiento</button>
        </div>

        {/* BLOQUE 2: MODALIDAD */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Modalidad:</span>
          <button onClick={() => setFiltroModalidad('TODOS')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filtroModalidad === 'TODOS' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 border'}`}>👀 Todas</button>
          <button onClick={() => setFiltroModalidad('OFREZCO')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filtroModalidad === 'OFREZCO' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 border border-purple-200'}`}>🤲 Ofrezco</button>
          <button onClick={() => setFiltroModalidad('BUSCO')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filtroModalidad === 'BUSCO' ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>🔍 Busco</button>
        </div>

        {/* ACCIONES EXTRAS */}
        <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l pt-3 lg:pt-0 lg:pl-4 w-full lg:w-auto justify-center">
          {(filtroCategoria !== 'TODOS' || filtroModalidad !== 'TODOS') && (
            <button
              onClick={() => { setFiltroCategoria('TODOS'); setFiltroModalidad('TODOS'); toast('Filtros restaurados', { icon: '🧹' }); }}
              className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors underline whitespace-nowrap"
            >
              🧹 Limpiar Filtros
            </button>
          )}

          <Link to="/favoritos" className="inline-flex px-4 py-2 rounded-lg text-xs font-bold transition-colors items-center gap-1 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 shadow-sm whitespace-nowrap">
            ❤️ Mis Favoritos ({favoritos.length})
          </Link>
        </div>
      </div>

      {/* GRID DE ANUNCIOS / SKELETONS */}
      {error && <div className="text-center py-10 text-red-600">❌ Error: {error}</div>}
      
      {/* SECCIÓN ACTUALIZADA: Mientras carga, pinta una malla de 6 Skeletons en vez del texto */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <AnuncioSkeleton key={n} />
          ))}
        </div>
      )}

      {!loading && !error && anunciosFiltrados.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl max-w-md mx-auto p-8 border border-dashed">
          <p className="text-gray-700 font-semibold">No se encontraron anuncios 📭</p>
          <p className="text-gray-500 mt-1 text-xs">Prueba a cambiar la combinación de filtros.</p>
        </div>
      )}

      {!loading && !error && anunciosFiltrados.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {anunciosFiltrados.map((anuncio) => (
            <AnuncioCard 
              key={anuncio._id} anuncio={anuncio} user={user} esFavorito={favoritos.includes(anuncio._id)}
              onToggleFavorito={() => manejarToggleFavorito(anuncio._id)} onEditar={cargarFormularioParaEditar} onBorrar={(id) => { setIdAnuncioABorrar(id); setModalBorrarOpen(true); }}
            />
          ))}
        </div>
      )}

      {/* COMPONENTES DE MODALES EXTRAÍDOS */}
      <AnuncioFormModal 
        isOpen={modalFormOpen} onClose={cerrarFormulario} onSubmit={manejarFormulario} editandoId={editandoId} enviando={enviando}
        titulo={titulo} setTitulo={setTitulo} descripcion={descripcion} setDescripcion={setDescripcion} tipo={tipo} setTipo={setTipo} modalidad={modalidad} setModalidad={setModalidad}
      />

      <ConfirmBorrarModal 
        isOpen={modalBorrarOpen} onClose={() => setModalBorrarOpen(false)} onConfirm={ejecutarBorradoReal}
      />
    </div>
  );
}