import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AnuncioCard from '../components/AnuncioCard';

export default function Favoritos({ user }) {
  const [anuncios, setAnuncios] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Leer los IDs guardados en favoritos locales
    const favsGuardados = JSON.parse(localStorage.getItem('ieshare_favoritos')) || [];
    setFavoritos(favsGuardados);

    // 2. Traer los anuncios del backend para poder filtrarlos y limpiarlos
    const obtenerAnuncios = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/posts`);
        if (!response.ok) throw new Error('Error al cargar anuncios');
        const data = await response.json();
        
        // --- MEJORA 3: LIMPIEZA DE FAVORITOS HUÉRFANOS ---
        // Creamos un set con todos los IDs de anuncios reales que existen en la BD de Mongo
        const idsExistentesEnBackend = new Set(data.map(anuncio => anuncio._id));
        
        // Filtramos la lista local quedándonos SOLO con los IDs que siguen existiendo en el servidor
        const favsLimpios = favsGuardados.filter(id => idsExistentesEnBackend.has(id));
        
        // Si la longitud es diferente, significa que había anuncios borrados guardados en el navegador
        if (favsLimpios.length !== favsGuardados.length) {
          localStorage.setItem('ieshare_favoritos', JSON.stringify(favsLimpios));
          setFavoritos(favsLimpios);
          console.log('🧹 Se han limpiado favoritos antiguos que ya no existen en el servidor.');
        }
        // -------------------------------------------------

        // Filtramos para quedarnos solo con los anuncios reales que el usuario tiene en favoritos
        const filtrados = data.filter(anuncio => favsLimpios.includes(anuncio._id));
        setAnuncios(filtrados);
      } catch (err) {
        toast.error('No se pudieron cargar tus favoritos 📡');
      } finally {
        setLoading(false);
      }
    };

    obtenerAnuncios();
  }, []);

  // Permitir quitar de favoritos desde esta misma pantalla
  const manejarQuitarFavorito = (idAnuncio) => {
    const nuevosFavs = favoritos.filter(id => id !== idAnuncio);
    setFavoritos(nuevosFavs);
    localStorage.setItem('ieshare_favoritos', JSON.stringify(nuevosFavs));
    
    // Lo quitamos de la vista inmediatamente
    setAnuncios(anuncios.filter(anuncio => anuncio._id !== idAnuncio));
    toast.success('Eliminado de tus favoritos');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* CABECERA DE FAVORITOS */}
      <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mis Anuncios Favoritos ❤️</h1>
          <p className="text-sm text-gray-600">Aquí tienes guardado el material y conocimiento que te interesa.</p>
        </div>
        <Link to="/" className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors">
          ⬅️ Volver al Tablón
        </Link>
      </header>

      {loading && <div className="text-center py-10 text-gray-600">Cargando tus favoritos...</div>}

      {!loading && anuncios.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl max-w-md mx-auto p-8 border border-dashed">
          <p className="text-gray-700 font-semibold text-lg">Tu lista está vacía 💔</p>
          <p className="text-gray-500 mt-1 text-xs mb-4">Aún no has marcado ningún anuncio con el corazón o los que tenías han sido eliminados.</p>
          <Link to="/" className="text-green-600 font-bold hover:underline text-sm">Explorar el tablón principal</Link>
        </div>
      )}

      {!loading && anuncios.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {anuncios.map((anuncio) => (
            <AnuncioCard 
              key={anuncio._id}
              anuncio={anuncio}
              user={user}
              esFavorito={true}
              onToggleFavorito={() => manejarQuitarFavorito(anuncio._id)}
              onEditar={() => toast.error('Debes editar tus anuncios desde el Tablón Principal 🏠')}
              onBorrar={() => toast.error('Debes borrar tus anuncios desde el Tablón Principal 🏠')}
            />
          ))}
        </div>
      )}
    </div>
  );
}