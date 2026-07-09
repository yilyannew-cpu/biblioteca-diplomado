const Usuario = require('../models/Usuarios');
async function probar(){
const usuarios = await Usuario.findAll(
    {raw:true}
);
console.log(usuarios);

console.log('Consultar por id');
const usuario = await Usuario.findByPk(1);
console.log(usuario.toJSON());
console.log('Consultar por nombre');
const usuario2 = await Usuario.findOne({
where:{
nombre:'Paula Sanchez'
}
});
console.log(usuario2.toJSON());
}
probar();