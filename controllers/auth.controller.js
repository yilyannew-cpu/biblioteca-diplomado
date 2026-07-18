const authService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const { nombre, correo, password, rol_id } = req.body;
    if (!nombre || !correo || !password) {
      return res.status(400).json({
        mensaje: 'nombre, correo y password son obligatorios',
      });
    }

    const usuario = await authService.registrar({ nombre, correo, password, rol_id });
    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(400).json({
        mensaje: 'correo y password son obligatorios',
      });
    }

    const result = await authService.login({ correo, password });
    res.status(200).json({
      mensaje: 'Login exitoso',
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
};
