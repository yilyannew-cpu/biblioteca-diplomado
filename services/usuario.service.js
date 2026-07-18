const bcrypt = require('bcryptjs');
const { Usuario, Rol, Permiso } = require('../models');

const SALT_ROUNDS = 10;

async function listar() {
  return Usuario.findAll({
    include: [
      {
        model: Rol,
        as: 'rol',
        include: [{ model: Permiso, as: 'permisos', through: { attributes: [] } }],
      },
    ],
    order: [['id', 'ASC']],
  });
}

async function obtenerPorId(id) {
  const usuario = await Usuario.findByPk(id, {
    include: [
      {
        model: Rol,
        as: 'rol',
        include: [{ model: Permiso, as: 'permisos', through: { attributes: [] } }],
      },
    ],
  });
  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }
  return usuario;
}

async function crear(data) {
  const { nombre, correo, password, rol_id } = data;
  if (!nombre || !correo || !password || !rol_id) {
    const error = new Error('nombre, correo, password y rol_id son obligatorios');
    error.status = 400;
    throw error;
  }

  const rol = await Rol.findByPk(rol_id);
  if (!rol) {
    const error = new Error('El rol indicado no existe');
    error.status = 400;
    throw error;
  }

  const existente = await Usuario.findOne({ where: { correo } });
  if (existente) {
    const error = new Error('El correo ya está registrado');
    error.status = 409;
    throw error;
  }

  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const usuario = await Usuario.create({
    nombre,
    correo,
    password: hash,
    rol_id,
  });

  return obtenerPorId(usuario.id);
}

async function actualizar(id, data) {
  const usuario = await Usuario.scope('withPassword').findByPk(id);
  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }

  const { nombre, correo, password, rol_id, activo } = data;

  if (rol_id !== undefined) {
    const rol = await Rol.findByPk(rol_id);
    if (!rol) {
      const error = new Error('El rol indicado no existe');
      error.status = 400;
      throw error;
    }
  }

  const updates = {
    ...(nombre !== undefined && { nombre }),
    ...(correo !== undefined && { correo }),
    ...(rol_id !== undefined && { rol_id }),
    ...(activo !== undefined && { activo }),
  };

  if (password) {
    updates.password = await bcrypt.hash(password, SALT_ROUNDS);
  }

  await usuario.update(updates);
  return obtenerPorId(id);
}

async function eliminar(id) {
  const usuario = await obtenerPorId(id);
  await usuario.destroy();
  return { mensaje: 'Usuario eliminado correctamente' };
}

module.exports = {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};
