const sequalize=require('../config/database');
const Libro=require('../models/Libro');
async function probar() {
    const libros=await Libro.findAll({
        raw:true
    });
    console.log(libros);
    
}
probar();