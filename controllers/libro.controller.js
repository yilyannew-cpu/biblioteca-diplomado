const libroService =require('../services/libro.service');

exports.getAll=async(req,res)=>{
    const libros=await libroService.getAll();
    res.json(libros);
};
exports.getById=async(req,res)=>{
    const libro=await libroService.getById(req.params.id);
    res.json(libro);
}

exports.create=async(req,res)=>{
    const libro=await libroService.create(req.body);
    res.json(libro);
}
exports.update=async(req,res)=>{
    const libro=await libroService.update(req.params.id,req.body);
    res.json(libro);
}
exports.delete=async(req,res)=>{
    const libro=await libroService.delete(req.params.id);
    res.json(libro);
}