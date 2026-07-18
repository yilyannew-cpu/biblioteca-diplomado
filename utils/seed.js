const bcrypt = require('bcryptjs');
const { Rol, Permiso, Usuario } = require('../models');

const PERMISOS = [
  { nombre: 'crear_libro', descripcion: 'Crear libros en el catálogo' },
  { nombre: 'editar_libro', descripcion: 'Editar libros del catálogo' },
  { nombre: 'eliminar_libro', descripcion: 'Eliminar libros del catálogo' },
  { nombre: 'ver_libros', descripcion: 'Consultar libros' },
  { nombre: 'gestionar_usuarios', descripcion: 'Administrar usuarios del sistema' },
  { nombre: 'crear_prestamo', descripcion: 'Registrar préstamos' },
  { nombre: 'devolver_prestamo', descripcion: 'Registrar devoluciones' },
  { nombre: 'ver_prestamos', descripcion: 'Consultar préstamos' },
];

const ROLES = {
  Admin: {
    descripcion: 'Acceso total al sistema',
    permisos: PERMISOS.map((p) => p.nombre),
  },
  Bibliotecario: {
    descripcion: 'Gestión de libros y préstamos',
    permisos: [
      'crear_libro',
      'editar_libro',
      'eliminar_libro',
      'ver_libros',
      'crear_prestamo',
      'devolver_prestamo',
      'ver_prestamos',
    ],
  },
  Lector: {
    descripcion: 'Consulta de libros y solicitud de préstamos',
    permisos: ['ver_libros', 'crear_prestamo', 'ver_prestamos'],
  },
};

async function seedRolesYPermisos() {
  const permisosMap = {};

  for (const p of PERMISOS) {
    const [permiso] = await Permiso.findOrCreate({
      where: { nombre: p.nombre },
      defaults: p,
    });
    permisosMap[p.nombre] = permiso;
  }

  const rolesMap = {};

  for (const [nombre, config] of Object.entries(ROLES)) {
    const [rol] = await Rol.findOrCreate({
      where: { nombre },
      defaults: { nombre, descripcion: config.descripcion },
    });

    const permisosDelRol = config.permisos.map((n) => permisosMap[n]).filter(Boolean);
    await rol.setPermisos(permisosDelRol);
    rolesMap[nombre] = rol;
  }

  const adminCorreo = process.env.ADMIN_EMAIL || 'admin@biblioteca.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

  const adminExistente = await Usuario.scope('withPassword').findOne({
    where: { correo: adminCorreo },
  });

  if (!adminExistente) {
    await Usuario.create({
      nombre: 'Administrador',
      correo: adminCorreo,
      password: await bcrypt.hash(adminPassword, 10),
      rol_id: rolesMap.Admin.id,
    });
    console.log(`Usuario admin creado: ${adminCorreo} / ${adminPassword}`);
  }

  console.log('Seed de roles y permisos completado');
  return rolesMap;
}

module.exports = seedRolesYPermisos;
