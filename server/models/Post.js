const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },
  tipo: {
    type: String,
    enum: ['MATERIAL', 'CONOCIMIENTO'], // Solo permite estos dos valores
    required: true
  },
  modalidad: {
    type: String,
    enum: ['OFREZCO', 'BUSCO'], // Solo permite estos dos valores
    required: true
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Esto vincula el anuncio con el ID de un usuario
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);