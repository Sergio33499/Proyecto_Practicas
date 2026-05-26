import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Evita parpadeos mientras lee localStorage

  useEffect(() => {
    // Comprobar si ya había una sesión guardada en el navegador
    const savedUser = localStorage.getItem('loggedUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (authData) => {
    setUser(authData.usuario); 
    localStorage.setItem('loggedUser', JSON.stringify(authData.usuario));
    localStorage.setItem('token', authData.token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('token');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen font-bold">Cargando aplicación...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* RUTA DE LOGIN: Si ya está logueado, lo redirige automáticamente al tablón */}
        <Route 
          path="/login" 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
        />

        {/* RUTA DE REGISTRO: Redirige al login tras registrarse */}
        <Route 
          path="/register" 
          element={!user ? <Register onRegisterSuccess={() => window.location.href = '/login'} /> : <Navigate to="/" />} 
        />

        {/* RUTA RAÍZ (TABLÓN): Si NO está logueado, lo rebota al login protegiendo la página */}
        <Route 
          path="/" 
          element={user ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />

        {/* CUALQUIER OTRA RUTA: Redirige al login por seguridad */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;