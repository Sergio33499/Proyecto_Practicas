import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // NUEVO: Importamos useLocation

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensajeVerificado, setMensajeVerificado] = useState(false); // NUEVO: Estado para el mensaje

  const location = useLocation(); // NUEVO: Para leer la URL

  useEffect(() => {
    // NUEVO: Comprobar si en la URL viene el ?verified=true
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('verified') === 'true') {
      setMensajeVerificado(true);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Por favor, rellena todos los campos');
      return;
    }

    try {
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
        onLogin(data);
      } else {
        // Captura tanto "Credenciales incorrectas" como el nuevo bloqueo de "Debes verificar tu cuenta..."
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

        {/* NUEVO: ALERTA DE ÉXITO INTEGRADA EN TU DISEÑO */}
        {mensajeVerificado && (
          <div style={{
            backgroundColor: '#d1fae5',
            color: '#065f46',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '15px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '14px',
            border: '1px solid #a7f3d0'
          }}>
            ✅ ¡Cuenta verificada con éxito!<br/>Ya puedes iniciar sesión.
          </div>
        )}

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
          <Link to="/register" className="auth-link login-link font-bold text-green-600 hover:underline">
            Regístrate aquí
          </Link>
        </p>
        
      </div>
    </div>
  );
}