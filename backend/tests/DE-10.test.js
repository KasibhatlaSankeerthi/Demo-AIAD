const request = require('supertest');
const bcrypt = require('bcryptjs');

jest.mock('../src/services/authService', () => ({
  findUserByEmail: jest.fn(),
}));

const { findUserByEmail } = require('../src/services/authService');
const app = require('../src/app');

describe('DE-10 POST /api/auth/login', () => {
  const originalSecret = process.env.JWT_ACCESS_SECRET;
  const originalExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_ACCESS_SECRET = 'test-secret';
    process.env.JWT_ACCESS_EXPIRES_IN = '15m';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    if (typeof originalSecret === 'undefined') {
      delete process.env.JWT_ACCESS_SECRET;
    } else {
      process.env.JWT_ACCESS_SECRET = originalSecret;
    }

    if (typeof originalExpiresIn === 'undefined') {
      delete process.env.JWT_ACCESS_EXPIRES_IN;
    } else {
      process.env.JWT_ACCESS_EXPIRES_IN = originalExpiresIn;
    }
  });

  test('DE-10-TC01 | missing email returns 400', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ password: 'password123' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Email and password are required' });
  });

  test('DE-10-TC02 | missing password returns 400', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Email and password are required' });
  });

  test('DE-10-TC03 | unknown user returns 401', async () => {
    findUserByEmail.mockResolvedValueOnce(null);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'missing@example.com', password: 'password123' });

    expect(findUserByEmail).toHaveBeenCalledWith('missing@example.com');
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Invalid email or password' });
  });

  test('DE-10-TC04 | wrong password returns 401', async () => {
    findUserByEmail.mockResolvedValueOnce({
      id: 1,
      first_name: 'Demo',
      last_name: 'User',
      email: 'demo@example.com',
      role: 'Basic',
      password_hash: 'hash',
      account_status: 1,
      is_deleted: 0,
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'demo@example.com', password: 'wrongpass' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Invalid email or password' });
  });

  test('DE-10-TC05 | suspended user returns 403', async () => {
    findUserByEmail.mockResolvedValueOnce({
      id: 2,
      first_name: 'Suspended',
      last_name: 'User',
      email: 'suspended@example.com',
      role: 'Basic',
      password_hash: 'hash',
      account_status: 0,
      is_deleted: 0,
    });
    const compareSpy = jest.spyOn(bcrypt, 'compare');

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'suspended@example.com', password: 'password123' });

    expect(compareSpy).not.toHaveBeenCalled();
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Account is suspended' });
  });

  test('DE-10-TC06 | deleted user returns 403', async () => {
    findUserByEmail.mockResolvedValueOnce({
      id: 3,
      first_name: 'Deleted',
      last_name: 'User',
      email: 'deleted@example.com',
      role: 'Basic',
      password_hash: 'hash',
      account_status: 1,
      is_deleted: 1,
    });
    const compareSpy = jest.spyOn(bcrypt, 'compare');

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'deleted@example.com', password: 'password123' });

    expect(compareSpy).not.toHaveBeenCalled();
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Account is deleted' });
  });

  test('DE-10-TC07 | valid credentials return token and safe user payload', async () => {
    findUserByEmail.mockResolvedValueOnce({
      id: 10,
      first_name: 'Valid',
      last_name: 'User',
      email: 'valid@example.com',
      role: 'Super',
      password_hash: 'hash',
      account_status: 1,
      is_deleted: 0,
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'valid@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(typeof response.body.accessToken).toBe('string');
    expect(response.body.user).toEqual({
      id: 10,
      firstName: 'Valid',
      lastName: 'User',
      email: 'valid@example.com',
      role: 'Super',
    });
    expect(response.body.user.password_hash).toBeUndefined();
  });

  test('DE-10-TC08 | missing JWT secret returns 500', async () => {
    findUserByEmail.mockResolvedValueOnce({
      id: 11,
      first_name: 'Secretless',
      last_name: 'User',
      email: 'secretless@example.com',
      role: 'Basic',
      password_hash: 'hash',
      account_status: 1,
      is_deleted: 0,
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
    delete process.env.JWT_ACCESS_SECRET;

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'secretless@example.com', password: 'password123' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'JWT_ACCESS_SECRET is not configured' });
  });

  test('DE-10-TC09 | invalid JWT expiry returns 500', async () => {
    findUserByEmail.mockResolvedValueOnce({
      id: 12,
      first_name: 'Expiring',
      last_name: 'User',
      email: 'expiring@example.com',
      role: 'Basic',
      password_hash: 'hash',
      account_status: 1,
      is_deleted: 0,
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
    process.env.JWT_ACCESS_EXPIRES_IN = 'not-a-valid-duration';

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'expiring@example.com', password: 'password123' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error' });
  });
});
