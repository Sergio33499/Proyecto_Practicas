const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Lo necesitamos para comparar las contraseñas
const jwt = require('jsonwebtoken'); // Para crear el token de sesión (Hito 4)

// 1. RUTA DE REGISTRO (La que ya tenías, se queda igual)
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const nuevoUsuario = new User({ nombre, email, password });
    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. RUTA DE LOGIN (La añadimos ahora)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Paso A: Buscar si el usuario existe por su email
    const usuario = await User.findOne({ email: email.toLowerCase() });
    if (!usuario) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }

    // Paso B: Comparar la contraseña que escribe el usuario con la que está oculta en la base de datos
    const passwordCorrecto = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecto) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }

    // Paso C: Generar el Token JWT (El pase para que se quede logueado)
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET || 'CLAVE_SECRETA_PROVISIONAL',
      { expiresIn: '7d' } // Expira en 7 días
    );

    // Si todo es correcto, respondemos con el token y los datos del usuario
    res.json({
      mensaje: '¡Login correcto!',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor al iniciar sesión' });
  }
});

module.exports = router;