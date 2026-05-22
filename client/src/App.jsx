import React, { useState, useEffect } from 'react';
import { anunciosMock } from './mocks/anunciosMock';
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('login');

  useEffect(() => {
    console.log("¡Cargando todos los datos del Mock! 👇");
    console.table(anunciosMock);

    // Comprobar si ya había una sesión guardada en el navegador
    const savedUser = localStorage.getItem('loggedUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Aquí recibimos el "data" completo que envía Express (con usuario y token)
  const handleLogin = (authData) => {
    setUser(authData.usuario); 
    // Guardamos todo el objeto (token incluido) para futuras peticiones a la API
    localStorage.setItem('loggedUser', JSON.stringify(authData.usuario));
    localStorage.setItem('token', authData.token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('token');
  };

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

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">IEShare Betxí - Tablón de Anuncios 🚀</h1>
          {/* Ahora usamos user.nombre que viene directo de tu base de datos de MongoDB */}
          <p className="dashboard-subtitle">Hola, <strong>{user.nombre}</strong> • Conectado como <strong>{user.email}</strong></p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </header>
      
      <hr className="separator" />
      
      <div className="ads-grid">
        {anunciosMock.map((anuncio) => (
          <div key={anuncio._id} className="ad-card">
            <img src={anuncio.imagen} alt={anuncio.titulo} className="ad-image" />
            <span className="ad-category">{anuncio.categoria}</span>
            <h3 className="ad-title">{anuncio.titulo}</h3>
            <p className="ad-price">
              {anuncio.precio === 0 ? '🎁 Gratis / Intercambio' : `${anuncio.precio}€`}
            </p>
            <p className="ad-description">{anuncio.descripcion}</p>
            <hr className="ad-divider" />
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