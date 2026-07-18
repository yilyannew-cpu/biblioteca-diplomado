const bcrypt = require('bcryptjs');
const { Usuario, Rol, Permiso } = require('../models');
const { signToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

async function registrar({ nombre, correo, password, rol_id }) {
  const existente = await Usuario.findOne({ where: { correo } });
  if (existente) {
    const error = new Error('El correo ya está registrado');
    error.status = 409;
    throw error;
  }

  let rolAsignado = rol_id;
  if (!rolAsignado) {
    const rolLector = await Rol.findOne({ where: { nombre: 'Lector' } });
    if (!rolLector) {
      const error = new Error('Rol Lector no configurado. Ejecute el seed primero.');
      error.status = 500;
      throw error;
    }
    rolAsignado = rolLector.id;
  } else {
    const rol = await Rol.findByPk(rolAsignado);
    if (!rol) {
      const error = new Error('El rol indicado no existe');
      error.status = 400;
      throw error;
    }
  }

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  const usuario = await Usuario.create({
    nombre,
    correo,
    password: hash,
    rol_id: rolAsignado,
  });

  return Usuario.findByPk(usuario.id, {
    include: [
      {
        model: Rol,
        as: 'rol',
        include: [{ model: Permiso, as: 'permisos', through: { attributes: [] } }],
      },
    ],
  });
}

async function login({ correo, password }) {
  const usuario = await Usuario.scope('withPassword').findOne({
    where: { correo },
    include: [
      {
        model: Rol,
        as: 'rol',
        include: [{ model: Permiso, as: 'permisos', through: { attributes: [] } }],
      },
    ],
  });

  if (!usuario || !usuario.activo) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const passwordOk = await bcrypt.compare(password, usuario.password);
  if (!passwordOk) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const permisos = (usuario.rol?.permisos || []).map((p) => p.nombre);

  const token = signToken({
    id: usuario.id,
    correo: usuario.correo,
    rol_id: usuario.rol_id,
    rol: usuario.rol?.nombre,
    permisos,
  });

  const usuarioSafe = usuario.toJSON();
  delete usuarioSafe.password;

  return { token, usuario: usuarioSafe };
}

module.exports = {
  registrar,
  login,
};
