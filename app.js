const express=require('express')
const app = express();
const PORT = 3000;
const pool = require('./config/db');
const usuarioRoutes=require('./routes/usuarios.routes');
const libroRoutes=require('./routes/libro.routes');
const prestamoRoutes=require('./routes/prestamo.routes');
// Middleware para leer JSON
app.use(express.json());

app.use('/usuarios',usuarioRoutes);
app.use('/libros',libroRoutes);
app.use('/prestamos',prestamoRoutes)
app.listen(PORT, () => {
console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
