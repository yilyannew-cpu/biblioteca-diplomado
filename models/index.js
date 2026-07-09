const Usuario = require("./Usuarios");
const Libro = require("./Libro");
const Prestamo = require("./Prestamos");
// Relaciones Usuario - Prestamo
Usuario.hasMany(Prestamo,{
foreignKey:"usuario_id"
});
Prestamo.belongsTo(Usuario,{
foreignKey:"usuario_id"
});
// Relaciones Libro - Prestamo
Libro.hasMany(Prestamo,{
foreignKey:"libro_id"
});
Prestamo.belongsTo(Libro,{
foreignKey:"libro_id"
});
module.exports={
Usuario,
Libro,
Prestamo
};