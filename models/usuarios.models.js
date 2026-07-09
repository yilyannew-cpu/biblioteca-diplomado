const pool = require('../config/db');

exports.getAll = async() => {
    const resultado = await pool.query(
     'SELECT * FROM usuarios ORDER BY id'
    );
    return resultado.rows;
};
exports.getById = async(id) => {
    const resultado = await pool.query(
     'SELECT * FROM usuarios WHERE id=$1',
     [id]
    );
    return resultado.rows[0];
};


exports.create = async (usuario)=>{
const resultado = await pool.query(
    `INSERT INTO usuarios(nombre,correo)
    VALUES($1,$2)
    RETURNING *`,
    [usuario.nombre,usuario.correo]
    );
    return resultado.rows[0];
};

exports.update = async(id,usuario)=>{
    const resultado = await pool.query(
        `UPDATE usuarios
         SET nombre=$1,
             correo=$2
         WHERE id=$3
         RETURNING *`,
        [
            usuario.nombre,
            usuario.correo,
            id
        ]
    );
    return resultado.rows[0];
};

exports.delete = async(id)=>{
    const resultado=await pool.query(
        `DELETE FROM usuarios WHERE id=$1
        RETURNING *`,
        [id]
    );
    return resultado.rows[0];
};
