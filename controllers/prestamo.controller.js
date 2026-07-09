const prestamoService=require('../services/prestamo.service');
exports.getAll=async(req,res)=>{
    const prestamos= await prestamoService.getAll();
    res.json(prestamos);
}
exports.getById=async(req,res)=>{
    const prestamos= await prestamoService.getById(req.params.id);
    res.json(prestamos);
}

exports.create=async(req,res)=>{
    try{
        const prestamo= await prestamoService.create(req.body);
        res.status(200).json(prestamo);
    }catch(error){
        res.status(400).json({mensaje:error.message});
    }
}

exports.devolucion=async(req,res)=>{
     try{
        const prestamo= await prestamoService.devolucion(req.params.id);
        res.status(200).json(prestamo);
    }catch(error){
        res.status(400).json({mensaje:error.message});
    }
}