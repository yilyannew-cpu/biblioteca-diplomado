const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Libro = sequelize.define(
  'Libro',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    autor: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    anio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    tableName: 'libros',
    timestamps: true,
  }
);

module.exports = Libro;
