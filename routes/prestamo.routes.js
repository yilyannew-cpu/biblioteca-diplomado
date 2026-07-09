const express=require('express');
const router=express.Router();
const prestamoController=require('../controllers/prestamo.controller');
router.get('/',prestamoController.getAll);
router.get('/:id',prestamoController.getById);
router.post('/',prestamoController.create);
router.put('/devolver/:id',prestamoController.devolucion);
module.exports=router;