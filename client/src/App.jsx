import React, { useEffect } from 'react';
import { anunciosMock } from './mocks/anunciosMock';

function App() {
  useEffect(() => {
    // Esto mostrará los anuncios de mentira en la consola del navegador
    console.log("¡Cargando anuncios desde el Mock del tutor! 👇");
    console.table(anunciosMock);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>IEShare Betxí - Modo Mocks Activo 🚀</h1>
      <p>Mira la consola del navegador (F12) para ver los datos cargados.</p>
      
      <hr />
      
      {/* Pintamos los títulos en la pantalla para comprobar que funciona */}
      <h2>Anuncios detectados:</h2>
      <ul>
        {anunciosMock.map((anuncio) => (
          <li key={anuncio._id}>
            <strong>{anuncio.titulo}</strong> - {anuncio.precio === 0 ? 'Gratis/Intercambio' : `${anuncio.precio}€`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;