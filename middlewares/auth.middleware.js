const { verifyToken } = require('../utils/jwt');
const { Usuario, Rol, Permiso } = require('../models');

/**
 * Verifica JWT en Authorization: Bearer <token>
 */
async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({
        mensaje: 'Token no proporcionado. Use Authorization: Bearer <token>',
      });
    }

    const token = header.slice(7);
    let payload;

    try {
      payload = verifyToken(token);
    } catch {
      return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }

    const usuario = await Usuario.findByPk(payload.id, {
      include: [
        {
          model: Rol,
          as: 'rol',
          include: [{ model: Permiso, as: 'permisos', through: { attributes: [] } }],
        },
      ],
    });

    if (!usuario || !usuario.activo) {
      return res.status(401).json({ mensaje: 'Usuario no autorizado o inactivo' });
    }

    req.user = usuario;
    req.permisos = (usuario.rol?.permisos || []).map((p) => p.nombre);
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Verifica que el rol del usuario tenga el permiso requerido.
 * Uso: authorize('crear_libro')
 */
function authorize(...permisosRequeridos) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ mensaje: 'No autenticado' });
    }

    const permisosUsuario = req.permisos || [];
    const autorizado = permisosRequeridos.some((p) => permisosUsuario.includes(p));

    if (!autorizado) {
      return res.status(403).json({
        mensaje: 'No tiene permiso para ejecutar esta acción',
        requeridos: permisosRequeridos,
      });
    }

    next();
  };
}

module.exports = {
  authenticate,
  authorize,
};
