function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const mensaje = err.message || 'Error interno del servidor';

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(status).json({
    mensaje,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
