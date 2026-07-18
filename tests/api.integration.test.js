/**
 * Prueba de integración: verifica que los endpoints HTTP respondan correctamente.
 */
const request = require('supertest');
const app = require('../app');

describe('API - integración', () => {
  test('GET /health debe responder 200 con estado ok', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('mensaje');
  });

  test('POST /api/auth/login sin credenciales debe responder 400', async () => {
    const res = await request(app).post('/api/auth/login').send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('mensaje');
  });

  test('GET /api/libros sin token debe responder 401', async () => {
    const res = await request(app).get('/api/libros');

    expect(res.status).toBe(401);
    expect(res.body.mensaje).toMatch(/token/i);
  });
});
