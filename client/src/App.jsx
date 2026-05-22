import React, { useState, useEffect } from 'react';
import { anunciosMock } from './mocks/anunciosMock';
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import './App.css'; // Asegúrate de importar el CSS modificado

function App() {
  // Estado para gestionar el usuario logueado
  const [user, setUser] = useState(null);
  
  // Estado para controlar qué pantalla de autenticación ver ('login' o 'register')
  const [screen, setScreen] = useState('login');

  // Efecto existente para tus Mocks + persistencia de sesión
  useEffect(() => {
    console.log("¡Cargando todos los datos del Mock! 👇");
    console.table(anunciosMock);

    // Comprobar si ya había una sesión guardada en el navegador
    const savedUser = localStorage.getItem('loggedUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Controladores de Login y Logout
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('loggedUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('loggedUser');
  };

  // VISTA 1: Si NO hay usuario, mostramos Login o Registro
  if (!user) {
    return (
      <>
        {screen === 'login' ? (
          <Login 
            onLogin={handleLogin} 
            onNavigateToRegister={() => setScreen('register')} 
          />
        ) : (
          <Register 
            onRegisterSuccess={() => setScreen('login')} 
            onNavigateToLogin={() => setScreen('login')} 
          />
        )}
      </>
    );
  }

  // VISTA 2: Si SÍ hay usuario, mostramos el tablón de anuncios protegido
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">IEShare Betxí - Tablón de Anuncios 🚀</h1>
          <p className="dashboard-subtitle">Modo Mocks Activo • Conectado como <strong>{user.email}</strong></p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </header>
      
      <hr className="separator" />
      
      {/* Contenedor de las tarjetas de anuncios */}
      <div className="ads-grid">
        {anunciosMock.map((anuncio) => (
          <div key={anuncio._id} className="ad-card">
            
            {/* 1. Imagen del anuncio */}
            <img 
              src={anuncio.imagen} 
              alt={anuncio.titulo} 
              className="ad-image" 
            />

            {/* 2. Categoría */}
            <span className="ad-category">
              {anuncio.categoria}
            </span>

            {/* 3. Título y Precio */}
            <h3 className="ad-title">{anuncio.titulo}</h3>
            <p className="ad-price">
              {anuncio.precio === 0 ? '🎁 Gratis / Intercambio' : `${anuncio.precio}€`}
            </p>

            {/* 4. Descripción larga */}
            <p className="ad-description">{anuncio.descripcion}</p>
            
            <hr className="ad-divider" />

            {/* 5. Datos del Creador */}
            <div className="ad-author">
              <p>👤 <strong>Subido por:</strong> {anuncio.creador.nombre}</p>
              <p style={{ color: 'var(--text-muted)' }}>📧 {anuncio.creador.email}</p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default App;