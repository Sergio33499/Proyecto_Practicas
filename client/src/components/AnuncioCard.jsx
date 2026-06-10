import React from 'react';
import toast from 'react-hot-toast';

export default function AnuncioCard({ anuncio, user, esFavorito, onToggleFavorito, onEditar, onBorrar }) {
  // Comprobación exacta de autoría que tenías en tu código
  const esMio = anuncio.autor?._id === user.id || anuncio.autor === user.id || anuncio.autor?._id === user._id || anuncio.autor === user._id;

  const handleContacto = () => {
    toast.success('Abriendo tu cliente de correo... ✉️');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-2">
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold uppercase">{anuncio.tipo}</span>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold uppercase">{anuncio.modalidad}</span>
          </div>
          
          {/* Botón de Favorito */}
          <button 
            onClick={onToggleFavorito}
            className="text-gray-300 hover:text-red-500 transition-colors p-1 focus:outline-none"
            title={esFavorito ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${esFavorito ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2">{anuncio.titulo}</h3>
        <p className="text-gray-600 text-sm mb-4 break-words">{anuncio.descripcion}</p>
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
            <button
              onClick={() => onEditar(anuncio)}
              className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold px-3 py-1.5 rounded transition-colors"
            >
              ✏️ Editar
            </button>
            <button
              onClick={() => onBorrar(anuncio._id)}
              className="bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold px-3 py-1.5 rounded transition-colors"
            >
              🗑️ Borrar
            </button>
          </>
        ) : (
          <a
            onClick={handleContacto}
            href={`mailto:${anuncio.autor?.email || ''}?subject=[IEShare Betxí] Me interesa tu anuncio: ${encodeURIComponent(anuncio.titulo)}`}
            className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-1.5 rounded shadow-sm transition-colors flex items-center gap-1"
          >
            ✉️ Contactar por Email
          </a>
        )}
      </div>
    </div>
  );
}