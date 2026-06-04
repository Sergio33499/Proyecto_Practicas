const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// DEFINICIÓN ÚNICA DEL ESQUEMA CON TODAS TUS VALIDACIONES DEL IES BETXÍ
const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Esta expresión regular obliga a que el email termine en @alu.edu.gva.es o @edu.gva.es
        return /^[a-zA-Z0-9._%+-]+@(alu\.edu\.gva\.es|edu\.gva\.es)$/.test(v);
      },
      message: props => `${props.value} no es un correo válido del IES Betxí (@alu.edu.gva.es o @edu.gva.es)`
    }
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: 6
  },
  
  // NUEVOS CAMPOS PARA LA VERIFICACIÓN DE CUENTA
  verificado: { 
    type: Boolean, 
    default: false // Por defecto, nadie está verificado al registrarse hasta que pulse el botón
  }, 
  verifyToken: { 
    type: String, 
    default: null 
  }
}, { timestamps: true }); // Esto añade automáticamente fecha de creación y actualización

// Middleware de Mongoose: se ejecuta justo ANTES de guardar el usuario
userSchema.pre('save', async function() {
  // Si no se ha cambiado la contraseña, no hacemos nada
  if (!this.isModified('password')) return;
  
  // Encriptamos la contraseña
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);