const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libro.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/', authenticate, authorize('ver_libros'), libroController.getAll);
router.get('/:id', authenticate, authorize('ver_libros'), libroController.getById);
router.post('/', authenticate, authorize('crear_libro'), libroController.create);
router.put('/:id', authenticate, authorize('editar_libro'), libroController.update);
router.delete('/:id', authenticate, authorize('eliminar_libro'), libroController.remove);

module.exports = router;
