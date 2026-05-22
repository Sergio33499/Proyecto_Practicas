import { useState } from 'react';

export default function Login({ onLogin, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      // Simulación de éxito pasando el objeto con el email
      onLogin({ email });
    } else {
      alert('Por favor, rellena todos los campos');
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