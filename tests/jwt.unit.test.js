/**
 * Prueba unitaria del helper JWT.
 */
require('dotenv').config();

const { signToken, verifyToken } = require('../utils/jwt');

describe('utils/jwt', () => {
  test('debe firmar y verificar un token correctamente', () => {
    const payload = { id: 1, correo: 'test@biblioteca.com' };
    const token = signToken(payload);

    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);

    const decoded = verifyToken(token);
    expect(decoded.id).toBe(1);
    expect(decoded.correo).toBe('test@biblioteca.com');
  });
});
