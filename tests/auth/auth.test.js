const request = require('supertest');
const { app } = require('../../server'); // Importa la instancia de Express
const User = require('../../src/models/userModel');


// --- Tests para el endpoint de Registro ---
describe('POST /api/auth/register', () => {
  it('Debe registrar un nuevo usuario exitosamente', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('Debe devolver 400 si el email ya está en uso', async () => {
    // Primero registra un usuario para que exista
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Existing User',
        email: 'duplicate@example.com',
        password: 'password123',
      });
    
    // Intenta registrar el mismo usuario de nuevo
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another User',
        email: 'duplicate@example.com',
        password: 'password123',
      });
    
    expect(res.statusCode).toEqual(400); // 400 Bad Request
    expect(res.body).toHaveProperty('message', 'El usuario ya existe');
  });
});

// --- Tests para el endpoint de Login ---
describe('POST /api/auth/login', () => {
  it('Debe autenticar un usuario y devolver un token', async () => {
    // Primero registra un usuario de prueba
    const user = await User.create({
      name: 'Login Test',
      email: 'login@example.com',
      password: 'loginpassword',
    });
    
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'loginpassword',
      });
      
    expect(res.statusCode).toEqual(200); // 200 OK
    expect(res.body).toHaveProperty('token');
  });

  it('Debe fallar con 401 para credenciales inválidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'notfound@example.com',
        password: 'wrongpassword',
      });
      
    expect(res.statusCode).toEqual(401); // 401 Unauthorized
    expect(res.body).toHaveProperty('message', 'Email o contraseña incorrecta');
  });
});