import { useState } from 'react';

export default function Login({ onLogin, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Por favor, rellena todos los campos');
      return;
    }

    try {
      // Toma la URL del docker-compose o usa localhost:5000 de respaldo
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // data contiene: { mensaje, token, usuario: { id, nombre, email } }
        onLogin(data);
      } else {
        // Captura el mensaje "Credenciales incorrectas" de tu auth.js
        alert(data.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error en el login:', error);
      alert('No se pudo conectar con el servidor backend. Asegúrate de que Docker esté corriendo.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              placeholder="tu@correo.com"
              required
            />
          </div>
          <div className="auth-input-group">
            <label className="auth-label">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="auth-button login-btn">
            Entrar
          </button>
        </form>
        <p className="auth-footer-text">
          ¿No tienes cuenta?{' '}
          <span onClick={onNavigateToRegister} className="auth-link login-link">
            Regístrate aquí
          </span>
        </p>
      </div>
    </div>
  );
}