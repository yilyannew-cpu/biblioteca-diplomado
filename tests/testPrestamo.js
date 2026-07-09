const {Prestamo,Usuario, Libro}=require('../models');

async function probar() {
    const prestamos=await Prestamo.findAll({
        raw:true,
        include:[Usuario,Libro]
    });
    console.log(prestamos);
    
}
probar();