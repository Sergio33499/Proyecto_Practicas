const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Lo necesitamos para comparar las contraseñas
const jwt = require('jsonwebtoken'); // Para crear el token de sesión (Hito 4)
const nodemailer = require('nodemailer'); // NUEVO: Para enviar correos
const crypto = require('crypto'); // NUEVO: Para crear tokens aleatorios de verificación

// NUEVO: Configuración oficial de Nodemailer para tu Gmail corporativo
const dispatcher = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // iesharebetxi@gmail.com
    pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación de 16 letras
  }
});

// 1. RUTA DE REGISTRO (Modificada para incluir verificación por email)
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Comprobar si el usuario ya existe para evitar duplicados
    const usuarioExiste = await User.findOne({ email: email.toLowerCase() });
    if (usuarioExiste) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    // GENERAR TOKEN DE VERIFICACIÓN ÚNICO
    const tokenVerificacion = crypto.randomBytes(32).toString('hex');

    // Creamos el nuevo usuario pasándole los campos de verificación
    const nuevoUsuario = new User({ 
      nombre, 
      email: email.toLowerCase(), 
      password,
      verificado: false, // Por defecto entra bloqueado
      verifyToken: tokenVerificacion
    });
    
    await nuevoUsuario.save();

    // ENVIAR EL CORREO ELECTRÓNICO REAL CON GMAIL
    const urlVerificacion = `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/verify/${tokenVerificacion}`;
    
    const opcionesEmail = {
      from: '"IEShare Betxí 🚀" <iesharebetxi@gmail.com>',
      to: nuevoUsuario.email,
      subject: 'Activa tu cuenta de IEShare Betxí',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #22c55e; text-align: center;">¡Bienvenido, ${nuevoUsuario.nombre}!</h1>
          <p>Gracias por registrarte en el Tablón de Anuncios de IEShare Betxí.</p>
          <p>Para evitar cuentas falsas y activar tu perfil, haz clic en el botón verde de abajo:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${urlVerificacion}" style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verificar mi Correo</a>
          </div>
          <p style="font-size: 12px; color: #666;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
          <p style="font-size: 12px; color: #0066cc; word-break: break-all;">${urlVerificacion}</p>
        </div>
      `
    };

    // Lanzamos el email a través de los servidores de Google
    await dispatcher.sendMail(opcionesEmail);

    res.status(201).json({ mensaje: 'Usuario registrado. Por favor, revisa tu correo electrónico para verificar la cuenta.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. RUTA DE LOGIN (Modificada para bloquear usuarios no verificados)
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

    // NUEVO PASO CRÍTICO: Comprobar si ha activado la cuenta
    if (!usuario.verificado) {
      return res.status(403).json({ error: 'Debes verificar tu cuenta por correo electrónico antes de iniciar sesión.' });
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

// 3. NUEVA RUTA: Recibe el clic del correo, activa el usuario en Mongo y lo manda al login del Frontend
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Buscamos al usuario que coincida con el token enviado por correo
    const usuario = await User.findOne({ verifyToken: token });

    if (!usuario) {
      return res.status(400).send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
          <h1 style="color: #ef4444;">❌ Enlace inválido</h1>
          <p>El token de verificación no existe o el correo ya ha sido validado.</p>
        </div>
      `);
    }

    // Modificamos sus flags de verificación
    usuario.verificado = true;
    usuario.verifyToken = null; // Eliminamos el token para que no se pueda reutilizar
    await usuario.save();

    // Redirigimos de golpe a tu Frontend pasándole la variable por la URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login?verified=true`);

  } catch (error) {
    res.status(500).send('Error interno al verificar la cuenta');
  }
});

module.exports = router;