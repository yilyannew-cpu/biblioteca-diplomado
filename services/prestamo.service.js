const prestamoModel=require('../models/prestamo.model');
const usuarioModel=require('../models/usuarios.models');
const libroModel=require('../models/libro.model');
exports.getAll=async()=>{
    return await prestamoModel.getAll(); 
}
exports.getById=async(id)=>{
    return await prestamoModel.getById(id); 
}
exports.create=async(prestamo)=>{
    const usuario=await usuarioModel.getById(prestamo.usuario_id);
    if(!usuario){
        throw new Error("El usuario no existe");
    }
    const libro =await libroModel.getById(prestamo.libro_id);
    if(!libro){
          throw new Error("El libro no existe");
      
    }
    if(await prestamoModel.libroPrestado(prestamo.libro_id)){
         throw new Error("El libro está prestado");

    }
    return await prestamoModel.create(prestamo); 
}

exports.devolucion= async(id)=>{
    const prestamo=await prestamoModel.getById(id);
    if(!prestamo){
        throw new Error("El préstamo no existe");   
    }
    if(prestamo.fecha_devolucion){
        throw new Error("El préstamo ya fue devuelto");        
    }
    return await prestamoModel.devolver(id);

}