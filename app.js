require('dotenv').config();

const express = require('express');
const { sequelize } = require('./models');
const apiRoutes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');
const seedRolesYPermisos = require('./utils/seed');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    mensaje: 'Servidor de Biblioteca activo',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api', apiRoutes);
app.use(errorHandler);

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida correctamente');

    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados');

    await seedRolesYPermisos();

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
}

// Solo arranca el servidor si se ejecuta directamente (no en tests)
if (require.main === module) {
  start();
}

module.exports = app;
