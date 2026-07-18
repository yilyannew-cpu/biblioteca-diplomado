const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const libroRoutes = require('./libro.routes');
const prestamoRoutes = require('./prestamo.routes');
const usuarioRoutes = require('./usuario.routes');

router.use('/auth', authRoutes);
router.use('/libros', libroRoutes);
router.use('/prestamos', prestamoRoutes);
router.use('/usuarios', usuarioRoutes);

module.exports = router;
