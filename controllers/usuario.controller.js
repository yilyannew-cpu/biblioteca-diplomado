const usuarioService = require('../services/usuario.service');

async function getAll(req, res, next) {
  try {
    const usuarios = await usuarioService.listar();
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const usuario = await usuarioService.obtenerPorId(req.params.id);
    res.json(usuario);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const usuario = await usuarioService.crear(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const usuario = await usuarioService.actualizar(req.params.id, req.body);
    res.json(usuario);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const result = await usuarioService.eliminar(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
