const pool=require('../config/db');
exports.getAll=async()=>{
    const resultado=await pool.query(
        'SELECT * FROM libros ORDER BY id' 
    );
    return resultado.rows;
};
exports.getById=async(id)=>{
    const resultado=await pool.query(
        'SELECT * FROM libros WHERE id=$1',
        [id]   
    );
    return resultado.rows[0];
};
exports.create=async(libro)=>{
    const resultado=await pool.query(
        `INSERT INTO libros 
        (titulo,autor,anio)
        VALUES($1,$2,$3)
        RETURNING *`,
        [libro.titulo,libro.autor,libro.anio]        
    );
    return resultado.rows[0];
};

exports.update=async(id,libro)=>{
   const resultado=await pool.query(
        `UPDATE libros
         SET titulo=$1,
         autor=$2,
         ANIO=$3
         WHERE id=$4
        RETURNING *`,
        [libro.titulo,libro.autor,libro.anio, id]        
    ); 
        return resultado.rows[0];

};
exports.delete=async(id)=>{
    const resultado=await pool.query(
        `DELETE FROM libros WHERE id=$1
        RETURNING *`,
        [id]
    );
    return resultado.rows[0];
};