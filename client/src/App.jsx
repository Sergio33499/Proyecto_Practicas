import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Favoritos from "./pages/Favoritos.jsx"; // IMPORTAMOS LA NUEVA PÁGINA
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
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
      {/* Contenedor de notificaciones flotantes */}
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{
          className: 'font-sans text-sm border shadow-md',
          duration: 4000,
        }}
      />

      <Routes>
        {/* RUTA DE LOGIN */}
        <Route 
          path="/login" 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
        />

        {/* RUTA DE REGISTRO */}
        <Route 
          path="/register" 
          element={!user ? <Register onRegisterSuccess={() => window.location.href = '/login'} /> : <Navigate to="/" />} 
        />

        {/* RUTA RAÍZ (TABLÓN PRINCIPAL) */}
        <Route 
          path="/" 
          element={user ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />

        {/* NUEVA RUTA PROTEGIDA PARA LA PÁGINA DE FAVORITOS */}
        <Route 
          path="/favoritos" 
          element={user ? <Favoritos user={user} /> : <Navigate to="/login" />} 
        />

        {/* CUALQUIER OTRA RUTA */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;