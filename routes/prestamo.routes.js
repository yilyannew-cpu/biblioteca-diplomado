const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamo.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/', authenticate, authorize('ver_prestamos'), prestamoController.getAll);
router.get('/:id', authenticate, authorize('ver_prestamos'), prestamoController.getById);
router.post('/', authenticate, authorize('crear_prestamo'), prestamoController.create);
router.put(
  '/devolver/:id',
  authenticate,
  authorize('devolver_prestamo'),
  prestamoController.devolucion
);

module.exports = router;
