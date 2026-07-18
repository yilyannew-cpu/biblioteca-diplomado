const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Permiso = sequelize.define(
  'Permiso',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'permisos',
    timestamps: true,
  }
);

module.exports = Permiso;
