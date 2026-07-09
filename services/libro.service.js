const libroModel =require('../models/libro.model');

exports.getAll=async()=>{
    return await libroModel.getAll();
};
exports.getById=async(id)=>{
    return await libroModel.getById(id);
}

exports.create=async(libro)=>{
    return await libroModel.create(libro);
}
exports.update=async(id,libro)=>{
    return await libroModel.update(id,libro);
}
exports.delete=async(id)=>{
    return await libroModel.delete(id);
}