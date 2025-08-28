const request = require('supertest');
const { app, server } = require('../../server');
const mongoose = require('mongoose');
const User = require('../../src/models/userModel');
const Post = require('../../src/models/postModel');
const jwt = require('jsonwebtoken');

let testUser;
let testPost;
let token;

// Crear un usuario y un post de prueba antes de todos los tests
beforeAll(async () => {
  // 1. Crear un usuario de prueba en la base de datos
  testUser = await User.create({
    name: 'Post Test User',
    email: 'posttest@example.com',
    password: 'password123',
  });
  // 2. Generar un token para el usuario de prueba
  token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  // 3. Crear un post de prueba asociado a este usuario
  testPost = await Post.create({
    title: 'Mi Primer Post',
    content: 'Este es un post para pruebas.',
    author: testUser._id,
  });
});

// Limpiar los posts y usuarios después de cada test para asegurar aislamiento
afterEach(async () => {
  await Post.deleteMany({});
  await User.deleteMany({});
  // Re-crear el usuario de prueba para el siguiente test
  testUser = await User.create({
    name: 'Post Test User',
    email: 'posttest@example.com',
    password: 'password123',
  });
  // Re-generar el token
  token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

// Limpiar la base de datos después de cada test
/*
afterEach(async () => {
  await Post.deleteMany({});
});
*/

// Cerrar la conexión y el servidor al final
/*
afterAll(async () => {
  await Post.deleteMany({});
  await User.deleteMany({}); // Opcional: limpiar los usuarios de prueba
});
*/

// POST /api/posts
describe('POST /api/posts', () => {
    it('Debe crear un post exitosamente con un usuario autenticado', async () => {
        const res = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Nuevo Post',
                content: 'Contenido del nuevo post.',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toBe('Nuevo Post');
    });

    it('Debe devolver 401 si no hay token de autenticación', async () => {
        const res = await request(app)
            .post('/api/posts')
            .send({
                title: 'Post sin auth',
                content: 'Este post debería fallar.',
            });
        expect(res.statusCode).toEqual(401);
    });
});

// GET /api/posts y /api/posts/:id
describe('GET /api/posts', () => {
    it('Debe obtener todos los posts', async () => {

        await Post.create({
            title: 'Test Post',
            content: 'Contenido del post.',
            author: testUser._id,
        });

        const res = await request(app).get('/api/posts');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Debe obtener un post por su ID', async () => {

        const newPost = await Post.create({
            title: 'Test Post',
            content: 'Contenido del post.',
            author: testUser._id,
        });

        const res = await request(app).get(`/api/posts/${newPost._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toEqual(newPost._id.toString());
    });

    it('Debe devolver 404 si el post no existe', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/api/posts/${fakeId}`);
        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toBe('Post no encontrado');
    });
});

// PUT /api/posts/:id
describe('PUT /api/posts/:id', () => {
    it('Debe actualizar un post exitosamente', async () => {
        
        const newPost = await Post.create({
            title: 'Test Post',
            content: 'Contenido del post.',
            author: testUser._id,
        });

        const res = await request(app)
            .put(`/api/posts/${newPost._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Título Actualizado' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.title).toBe('Título Actualizado');
    });

    it('Debe devolver 401 si el post no pertenece al usuario', async () => {
        
        const newPost = await Post.create({
            title: 'Test Post',
            content: 'Contenido del post.',
            author: testUser._id,
        });
        
        const anotherUser = await User.create({
            name: 'Otro Usuario',
            email: 'other@example.com',
            password: 'password456',
        });
        const anotherToken = jwt.sign({ id: anotherUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const res = await request(app)
            .put(`/api/posts/${newPost._id}`)
            .set('Authorization', `Bearer ${anotherToken}`)
            .send({ title: 'Intento de hackeo' });

        expect(res.statusCode).toEqual(401);
    });

    it('Debe devolver 404 si el post no existe', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .put(`/api/posts/${fakeId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Intento de actualizar' });

        expect(res.statusCode).toEqual(404);
    });
});

// DELETE /api/posts/:id
describe('DELETE /api/posts/:id', () => {
    it('Debe eliminar un post exitosamente', async () => {
        const newPost = await Post.create({
            title: 'Post a eliminar',
            content: 'Contenido del post.',
            author: testUser._id,
        });

        const res = await request(app)
            .delete(`/api/posts/${newPost._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Post eliminado');
    });

    it('Debe devolver 401 si el post no pertenece al usuario', async () => {
        
        const newPost = await Post.create({
            title: 'Test Post',
            content: 'Contenido del post.',
            author: testUser._id,
        });

        const anotherUser = await User.create({
            name: 'Usuario de prueba',
            email: 'user@example.com',
            password: 'password123',
        });
        const anotherToken = jwt.sign({ id: anotherUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const res = await request(app)
            .delete(`/api/posts/${newPost._id}`)
            .set('Authorization', `Bearer ${anotherToken}`);

        expect(res.statusCode).toEqual(401);
    });

    it('Debe devolver 404 si el post no existe', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .delete(`/api/posts/${fakeId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(404);
    });
});