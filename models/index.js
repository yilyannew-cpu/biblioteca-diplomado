const sequelize = require('../config/database');
const Rol = require('./Rol');
const Permiso = require('./Permiso');
const Usuario = require('./Usuario');
const Libro = require('./Libro');
const Prestamo = require('./Prestamo');

// Rol <-> Permiso (Many-to-Many) vía tabla intermedia Rol_Permisos
Rol.belongsToMany(Permiso, {
  through: 'Rol_Permisos',
  foreignKey: 'rol_id',
  otherKey: 'permiso_id',
  as: 'permisos',
});

Permiso.belongsToMany(Rol, {
  through: 'Rol_Permisos',
  foreignKey: 'permiso_id',
  otherKey: 'rol_id',
  as: 'roles',
});

// Usuario -> Rol
Rol.hasMany(Usuario, {
  foreignKey: 'rol_id',
  as: 'usuarios',
});

Usuario.belongsTo(Rol, {
  foreignKey: 'rol_id',
  as: 'rol',
});

// Usuario <-> Prestamo
Usuario.hasMany(Prestamo, {
  foreignKey: 'usuario_id',
  as: 'prestamos',
});

Prestamo.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario',
});

// Libro <-> Prestamo
Libro.hasMany(Prestamo, {
  foreignKey: 'libro_id',
  as: 'prestamos',
});

Prestamo.belongsTo(Libro, {
  foreignKey: 'libro_id',
  as: 'libro',
});

module.exports = {
  sequelize,
  Rol,
  Permiso,
  Usuario,
  Libro,
  Prestamo,
};
