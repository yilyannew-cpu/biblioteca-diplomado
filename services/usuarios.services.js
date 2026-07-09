const usuarioModel = require('../models/usuarios.models');
const usuario=require('../models/Usuarios');
/*exports.getAll = async ()=>{
    return await usuarioModel.getAll();
};*/

exports.getAll = async ()=>{
    return await usuario.findAll();
};
exports.getById = async (id)=>{
    return await usuario.findByPk(id);
};

exports.create = async(usuario)=>{
return await usuarioModel.create(usuario);
};

exports.update = async (id, usuario) => {
    return await usuarioModel.update(id, usuario);
};

exports.delete = async (id) => {
    return await usuarioModel.delete(id);
};