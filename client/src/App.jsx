import React, { useEffect } from 'react';
import { anunciosMock } from './mocks/anunciosMock';

function App() {
  useEffect(() => {
    console.log("¡Cargando todos los datos del Mock! 👇");
    console.table(anunciosMock);
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f9', minHeight: '100vh' }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>IEShare Betxí - Tablón de Anuncios 🚀</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>Modo Mocks Activo (Datos de prueba para maquetar)</p>
      
      <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #ccc' }} />
      
      {/* Contenedor de las tarjetas */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        
        {anunciosMock.map((anuncio) => (
          <div key={anuncio._id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#fff',
            width: '300px',
            padding: '15px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            {/* 1. Imagen del anuncio */}
            <img 
              src={anuncio.imagen} 
              alt={anuncio.titulo} 
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }} 
            />

            {/* 2. Categoría en pequeñito */}
            <span style={{ 
              display: 'inline-block', 
              backgroundColor: '#e2e8f0', 
              color: '#4a5568', 
              fontSize: '12px', 
              padding: '3px 8px', 
              borderRadius: '12px',
              marginTop: '10px'
            }}>
              {anuncio.categoria}
            </span>

            {/* 3. Título y Precio */}
            <h3 style={{ margin: '10px 0 5px 0', fontSize: '18px', color: '#2d3748' }}>{anuncio.titulo}</h3>
            <p style={{ fontWeight: 'bold', color: '#3182ce', margin: '0 0 10px 0' }}>
              {anuncio.precio === 0 ? '🎁 Gratis / Intercambio' : `${anuncio.precio}€`}
            </p>

            {/* 4. Descripción larga */}
            <p style={{ fontSize: '14px', color: '#718096', lineHeight: '1.4' }}>{anuncio.descripcion}</p>
            
            <hr style={{ border: '0', borderTop: '1px solid #edf2f7', margin: '15px 0' }} />

            {/* 5. Datos del Creador (Anidado) */}
            <div style={{ fontSize: '12px', color: '#4a5568' }}>
              <p style={{ margin: '2px 0' }}>👤 <strong>Subido por:</strong> {anuncio.creador.nombre}</p>
              <p style={{ margin: '2px 0', color: '#718096' }}>📧 {anuncio.creador.email}</p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default App;