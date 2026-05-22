import { useState } from 'react';

export default function Register({ onRegisterSuccess, onNavigateToLogin }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre || !email || !password || !confirmPassword) {
      alert('Todos los campos son obligatorios');
      return;
    }
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    try {
      // Toma la URL del docker-compose o usa localhost:5000 de respaldo
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('¡Usuario registrado con éxito en MongoDB! 🎉');
        onRegisterSuccess(); // Vuelve automáticamente al Login
      } else {
        alert(data.error || 'Error al registrar el usuario');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('No se pudo conectar con el servidor backend. Asegúrate de que Docker esté corriendo.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Crear Cuenta</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="auth-input"
              placeholder="Tu nombre completo"
              required
            />
          </div>
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
          <div className="auth-input-group">
            <label className="auth-label">Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="auth-input"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="auth-button register-btn">
            Registrarse
          </button>
        </form>
        <p className="auth-footer-text">
          ¿Ya tienes cuenta?{' '}
          <span onClick={onNavigateToLogin} className="auth-link register-link">
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
}