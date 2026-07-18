const { sequelize, Prestamo, Libro, Usuario } = require('../models');

const MAX_PRESTAMOS_ACTIVOS = Number(process.env.MAX_PRESTAMOS_ACTIVOS) || 3;

async function listar() {
  return Prestamo.findAll({
    include: [
      { model: Usuario, as: 'usuario' },
      { model: Libro, as: 'libro' },
    ],
    order: [['id', 'DESC']],
  });
}

async function obtenerPorId(id) {
  const prestamo = await Prestamo.findByPk(id, {
    include: [
      { model: Usuario, as: 'usuario' },
      { model: Libro, as: 'libro' },
    ],
  });
  if (!prestamo) {
    const error = new Error('Préstamo no encontrado');
    error.status = 404;
    throw error;
  }
  return prestamo;
}

/**
 * Reglas de negocio:
 * 1. No se puede prestar si stock === 0
 * 2. Un usuario no puede exceder MAX_PRESTAMOS_ACTIVOS
 * 3. Se descuenta 1 del stock al crear el préstamo
 */
async function crear({ usuario_id, libro_id, fecha_prestamo }) {
  if (!usuario_id || !libro_id) {
    const error = new Error('usuario_id y libro_id son obligatorios');
    error.status = 400;
    throw error;
  }

  return sequelize.transaction(async (t) => {
    const usuario = await Usuario.findByPk(usuario_id, { transaction: t });
    if (!usuario) {
      const error = new Error('El usuario no existe');
      error.status = 404;
      throw error;
    }

    const libro = await Libro.findByPk(libro_id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!libro) {
      const error = new Error('El libro no existe');
      error.status = 404;
      throw error;
    }

    if (libro.stock <= 0) {
      const error = new Error(
        'No se puede registrar el préstamo: el libro no tiene stock disponible'
      );
      error.status = 400;
      throw error;
    }

    const prestamosActivos = await Prestamo.count({
      where: {
        usuario_id,
        estado: 'activo',
        fecha_devolucion: null,
      },
      transaction: t,
    });

    if (prestamosActivos >= MAX_PRESTAMOS_ACTIVOS) {
      const error = new Error(
        `El usuario ya tiene ${MAX_PRESTAMOS_ACTIVOS} préstamos activos. Debe devolver uno antes de solicitar otro.`
      );
      error.status = 400;
      throw error;
    }

    const prestamo = await Prestamo.create(
      {
        usuario_id,
        libro_id,
        fecha_prestamo: fecha_prestamo || new Date().toISOString().slice(0, 10),
        estado: 'activo',
      },
      { transaction: t }
    );

    await libro.update({ stock: libro.stock - 1 }, { transaction: t });

    return Prestamo.findByPk(prestamo.id, {
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Libro, as: 'libro' },
      ],
      transaction: t,
    });
  });
}

async function devolver(id) {
  return sequelize.transaction(async (t) => {
    const prestamo = await Prestamo.findByPk(id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!prestamo) {
      const error = new Error('El préstamo no existe');
      error.status = 404;
      throw error;
    }

    if (prestamo.estado === 'devuelto' || prestamo.fecha_devolucion) {
      const error = new Error('El préstamo ya fue devuelto');
      error.status = 400;
      throw error;
    }

    const libro = await Libro.findByPk(prestamo.libro_id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    await prestamo.update(
      {
        fecha_devolucion: new Date().toISOString().slice(0, 10),
        estado: 'devuelto',
      },
      { transaction: t }
    );

    if (libro) {
      await libro.update({ stock: libro.stock + 1 }, { transaction: t });
    }

    return Prestamo.findByPk(id, {
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Libro, as: 'libro' },
      ],
      transaction: t,
    });
  });
}

module.exports = {
  listar,
  obtenerPorId,
  crear,
  devolver,
};
