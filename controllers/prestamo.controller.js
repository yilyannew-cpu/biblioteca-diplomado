const prestamoService = require('../services/prestamo.service');

async function getAll(req, res, next) {
  try {
    const prestamos = await prestamoService.listar();
    res.json(prestamos);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const prestamo = await prestamoService.obtenerPorId(req.params.id);
    res.json(prestamo);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const payload = {
      ...req.body,
      usuario_id: req.body.usuario_id || req.user?.id,
    };
    const prestamo = await prestamoService.crear(payload);
    res.status(201).json(prestamo);
  } catch (error) {
    next(error);
  }
}

async function devolucion(req, res, next) {
  try {
    const prestamo = await prestamoService.devolver(req.params.id);
    res.json(prestamo);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll,
  getById,
  create,
  devolucion,
};
