import React from 'react';
import { anunciosMock } from '../mocks/anunciosMock';

export default function Home({ user, onLogout }) {
  return (
    <div className="dashboard-container p-6 bg-gray-50 min-h-screen">
      <header className="dashboard-header flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">IEShare Betxí - Tablón de Anuncios 🚀</h1>
          <p className="text-sm text-gray-600">
            Hola, <strong className="text-green-600">{user.nombre}</strong> • Conectado como <strong>{user.email}</strong>
          </p>
        </div>
        <button 
          onClick={onLogout} 
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Cerrar Sesión
        </button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {anunciosMock.map((anuncio) => (
          <div key={anuncio._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <img src={anuncio.imagen} alt={anuncio.titulo} className="w-full h-48 object-cover" />
            <div className="p-4">
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold uppercase mb-2">
                {anuncio.categoria}
              </span>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{anuncio.titulo}</h3>
              <p className="text-xl font-extrabold text-gray-900 mb-3">
                {anuncio.precio === 0 ? '🎁 Gratis / Intercambio' : `${anuncio.precio}€`}
              </p>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{anuncio.descripcion}</p>
              <hr className="border-gray-100 my-3" />
              <div className="text-xs text-gray-500">
                <p>👤 <strong>Subido por:</strong> {anuncio.creador.nombre}</p>
                <p className="text-gray-400 mt-0.5">📧 {anuncio.creador.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}