const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const protegerRuta = require('../middlewares/authMiddleware'); // Importamos tu guardián del Paso 2

// 1. CREAR ANUNCIO (Ruta Protegida con el middleware)
router.post('/', protegerRuta, async (req, res) => {
  try {
    const { titulo, descripcion, tipo, modalidad } = req.body;
    
    // req.user.id se extrae automáticamente del Token JWT gracias al middleware
    const nuevoPost = new Post({
      titulo,
      descripcion,
      tipo,
      modalidad,
      autor: req.user.id 
    });

    await nuevoPost.save();
    res.status(201).json({ mensaje: 'Anuncio publicado con éxito 🎉', post: nuevoPost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. LEER TODOS LOS ANUNCIOS (Ruta Pública para el Feed de la Home)
router.get('/', async (req, res) => {
  try {
    // Buscamos los anuncios y usamos .populate() para que en vez de solo el ID del autor,
    // nos traiga mágicamente su Nombre y Email oficiales de la colección Users.
    const posts = await Post.find()
      .populate('autor', 'nombre email')
      .sort({ createdAt: -1 }); // Los más nuevos aparecerán primero

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los anuncios del servidor' });
  }
});

// 3. EDITAR ANUNCIO (Ruta Protegida - Solo el dueño original puede modificarlo)
router.put('/:id', protegerRuta, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'El anuncio no existe' });
    }

    // CONTROL DE SEGURIDAD: Comparamos el ID del dueño del anuncio con el ID del token
    if (post.autor.toString() !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para editar este anuncio. No eres el propietario.' });
    }

    // Si pasa la seguridad, actualizamos con los nuevos datos recibidos
    const { titulo, descripcion, tipo, modalidad } = req.body;
    if (titulo) post.titulo = titulo;
    if (descripcion) post.descripcion = descripcion;
    if (tipo) post.tipo = tipo;
    if (modalidad) post.modalidad = modalidad;

    await post.save();
    res.json({ mensaje: 'Anuncio actualizado con éxito', post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. BORRAR ANUNCIO (Ruta Protegida - Solo el dueño original puede eliminarlo)
router.delete('/:id', protegerRuta, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'El anuncio no existe' });
    }

    // CONTROL DE SEGURIDAD: Comparamos el ID del dueño del anuncio con el ID del token
    if (post.autor.toString() !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para borrar este anuncio. No eres el propietario.' });
    }

    await post.deleteOne();
    res.json({ mensaje: 'Anuncio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el anuncio' });
  }
});

module.exports = router;