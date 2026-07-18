const { Libro } = require('../models');

async function listar() {
  return Libro.findAll({ order: [['id', 'ASC']] });
}

async function obtenerPorId(id) {
  const libro = await Libro.findByPk(id);
  if (!libro) {
    const error = new Error('Libro no encontrado');
    error.status = 404;
    throw error;
  }
  return libro;
}

async function crear(data) {
  const { titulo, autor, anio, stock = 0 } = data;
  if (!titulo || !autor || anio === undefined) {
    const error = new Error('titulo, autor y anio son obligatorios');
    error.status = 400;
    throw error;
  }
  return Libro.create({ titulo, autor, anio, stock });
}

async function actualizar(id, data) {
  const libro = await obtenerPorId(id);
  const { titulo, autor, anio, stock } = data;
  await libro.update({
    ...(titulo !== undefined && { titulo }),
    ...(autor !== undefined && { autor }),
    ...(anio !== undefined && { anio }),
    ...(stock !== undefined && { stock }),
  });
  return libro;
}

async function eliminar(id) {
  const libro = await obtenerPorId(id);
  await libro.destroy();
  return { mensaje: 'Libro eliminado correctamente' };
}

module.exports = {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};
