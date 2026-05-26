const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token de sesión.' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  try {
    // Fíjate que aquí usamos la misma clave provisional que tu auth.js
    const verificado = jwt.verify(token, process.env.JWT_SECRET || 'CLAVE_SECRETA_PROVISIONAL');
    req.user = verificado;
    next(); 
  } catch (error) {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
};