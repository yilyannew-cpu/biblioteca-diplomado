const pool=require('../config/db');
exports.getAll=async()=>{
    const resultado= await pool.query(
        `SELECT P.ID,
            P.fecha_prestamo, 
            P.FECHA_DEVOLUCION,
            U.NOMBRE as usuario,
            L.TITULO as libro
            FROM PRESTAMOS P
            INNER JOIN USUARIOS U
            ON P.USUARIO_ID=U.ID
            INNER JOIN LIBROS L
            ON P.LIBRO_ID=L.ID
        `
    );
    return resultado.rows;
}
exports.getById=async(id)=>{
    const resultado= await pool.query(
        `SELECT P.ID,
            P.fecha_prestamo, 
            P.FECHA_DEVOLUCION,
            U.NOMBRE as usuario,
            L.TITULO as libro
            FROM PRESTAMOS P
            INNER JOIN USUARIOS U
            ON P.USUARIO_ID=U.ID
            INNER JOIN LIBROS L
            ON P.LIBRO_ID=L.ID
            WHERE P.ID=$1
        `,
        [id]
    );
    return resultado.rows[0];
}

exports.libroPrestado = async(idLibro)=>{
    const resultado = await pool.query(
        `SELECT *
        FROM prestamos
        WHERE libro_id=$1
        AND fecha_devolucion IS NULL`,
        [idLibro]
    );
    return resultado.rows.length>0;
};

exports.create = async (prestamo)=>{
const resultado = await pool.query(
    `INSERT INTO prestamos(usuario_id,libro_id,fecha_prestamo)
    VALUES($1,$2,CURRENT_DATE)
    RETURNING *`,
    [prestamo.usuario_id,prestamo.libro_id]
    );
    return resultado.rows[0];
};

exports.devolver=async(id)=>{
    const resultado=await pool.query(
        `UPDATE prestamos
        SET fecha_devolucion=CURRENT_DATE
        WHERE id=$1
        RETURNING *`,
        [id]
    );
return resultado.rows[0];
};