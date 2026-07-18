/**
 * Prueba unitaria: reglas de negocio del servicio de préstamos.
 * No toca la base de datos real; mockea los modelos Sequelize.
 */
jest.mock('../models', () => ({
  sequelize: {
    transaction: async (callback) =>
      callback({
        LOCK: { UPDATE: 'UPDATE' },
      }),
  },
  Prestamo: {
    count: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
  },
  Libro: {
    findByPk: jest.fn(),
  },
  Usuario: {
    findByPk: jest.fn(),
  },
}));

const { Prestamo, Libro, Usuario } = require('../models');
const prestamoService = require('../services/prestamo.service');

describe('prestamo.service - reglas de negocio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe rechazar el préstamo si el stock del libro es 0', async () => {
    Usuario.findByPk.mockResolvedValue({ id: 1, nombre: 'Lector' });
    Libro.findByPk.mockResolvedValue({
      id: 10,
      titulo: 'Clean Code',
      stock: 0,
      update: jest.fn(),
    });

    await expect(
      prestamoService.crear({ usuario_id: 1, libro_id: 10 })
    ).rejects.toMatchObject({
      message: expect.stringContaining('stock'),
      status: 400,
    });

    expect(Prestamo.create).not.toHaveBeenCalled();
  });

  test('debe crear el préstamo y descontar stock cuando hay disponibilidad', async () => {
    const libroMock = {
      id: 10,
      titulo: 'Clean Code',
      stock: 2,
      update: jest.fn().mockResolvedValue(true),
    };

    Usuario.findByPk.mockResolvedValue({ id: 1, nombre: 'Lector' });
    Libro.findByPk.mockResolvedValue(libroMock);
    Prestamo.count.mockResolvedValue(0);
    Prestamo.create.mockResolvedValue({ id: 99 });
    Prestamo.findByPk.mockResolvedValue({
      id: 99,
      usuario_id: 1,
      libro_id: 10,
      estado: 'activo',
    });

    const resultado = await prestamoService.crear({
      usuario_id: 1,
      libro_id: 10,
    });

    expect(Prestamo.create).toHaveBeenCalled();
    expect(libroMock.update).toHaveBeenCalledWith(
      { stock: 1 },
      expect.any(Object)
    );
    expect(resultado.id).toBe(99);
  });
});
