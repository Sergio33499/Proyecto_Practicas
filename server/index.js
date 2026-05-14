const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- BLOQUE DE CONEXIÓN A MONGODB ACTUALIZADO ---
const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000, // Espera máximo 5 segundos
  family: 4                       // Fuerza el uso de IPv4 (clave en institutos)
})
  .then(() => {
    console.log('✅ ¡Conexión exitosa a MongoDB Atlas!');
  })
  .catch((err) => {
    console.log('❌ Error de conexión. Posibles causas:');
    console.log('   1. El firewall del instituto bloquea el puerto 27017.');
    console.log('   2. La contraseña en el .env es incorrecta.');
    console.log('   3. No has guardado los cambios en Atlas (0.0.0.0/0).');
    // console.error(err); // Descomenta esta línea si quieres ver el error gigante otra vez
  });
// ------------------------------------------------

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor de mi Proyecto DAW funcionando 🚀');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});