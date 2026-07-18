const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prestamo = sequelize.define(
  'Prestamo',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    libro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_prestamo: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_devolucion: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM('activo', 'devuelto'),
      allowNull: false,
      defaultValue: 'activo',
    },
  },
  {
    tableName: 'prestamos',
    timestamps: true,
  }
);

module.exports = Prestamo;
