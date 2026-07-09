const { Pool } = require('pg');
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123456',
    database: 'biblioteca'
});
pool.query('SELECT NOW()', (error, resultado)=>{
    if(error){
console.log(error);
}else{
    console.log(resultado.rows);
}
});
module.exports=pool;