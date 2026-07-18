const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/', authenticate, authorize('gestionar_usuarios'), usuarioController.getAll);
router.get('/:id', authenticate, authorize('gestionar_usuarios'), usuarioController.getById);
router.post('/', authenticate, authorize('gestionar_usuarios'), usuarioController.create);
router.put('/:id', authenticate, authorize('gestionar_usuarios'), usuarioController.update);
router.delete('/:id', authenticate, authorize('gestionar_usuarios'), usuarioController.remove);

module.exports = router;
