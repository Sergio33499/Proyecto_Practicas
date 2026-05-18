const express = require('express');
const router = express.Router();
const User = require('../models/User');

// RUTA DE REGISTRO: POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Crear el nuevo usuario usando el modelo
    const nuevoUsuario = new User({ nombre, email, password });
    
    // Guardar en la base de datos (aquí saltará la validación del email)
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
  } catch (error) {
    // Si el email no es @edu.gva.es, el error llegará aquí
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;