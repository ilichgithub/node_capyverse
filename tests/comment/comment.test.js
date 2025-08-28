// __tests__/comment/comment.test.js
const request = require('supertest');
const { app } = require('../../server');
const mongoose = require('mongoose');
const User = require('../../src/models/userModel');
const Post = require('../../src/models/postModel');
const Comment = require('../../src/models/commentModel');
const jwt = require('jsonwebtoken');

let testUser;
let token;
let testPost;

// Limpiar la base de datos después de cada test
beforeEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    // Volver a crear los recursos para que el siguiente test pueda usarlos
    testUser = await User.create({
        name: 'Comment Test User',
        email: 'commenttest@example.com',
        password: 'password123',
    });
    token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    testPost = await Post.create({
        title: 'Post con comentarios',
        content: 'Este post tiene comentarios de prueba.',
        author: testUser._id,
    });
});

// --- Tests para el endpoint de crear comentario ---
describe('POST /api/posts/:postId/comments', () => {
    it('Debe crear un comentario exitosamente', async () => {
        const res = await request(app)
            .post(`/api/comments/${testPost._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'Nuevo comentario de prueba' });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.content).toBe('Nuevo comentario de prueba');
    });

    it('Debe devolver 404 si el post no existe', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .post(`/api/comments/${fakeId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'Comentario en post inexistente' });

        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toBe('Post no encontrado');
    });
});

// --- Tests para el endpoint de obtener comentarios ---
describe('GET /api/posts/:postId/comments', () => {
    it('Debe obtener todos los comentarios de un post', async () => {

        testComment = await Comment.create({
            content: 'Primer comentario.',
            author: testUser._id,
            post: testPost._id,
        });

        const res = await request(app).get(`/api/comments/${testPost._id}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].content).toBe('Primer comentario.');
    });

    it('Debe devolver un arreglo vacío si el post no tiene comentarios', async () => {
        const anotherPost = await Post.create({
            title: 'Post sin comentarios',
            content: 'Este post no tiene comentarios.',
            author: testUser._id,
        });
        const res = await request(app).get(`/api/comments/${anotherPost._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(0);
    });
});

// --- Tests para el endpoint de eliminar comentario ---
describe('DELETE /api/comments/:id', () => {
    it('Debe eliminar un comentario exitosamente', async () => {
        const commentToDelete = await Comment.create({
            content: 'Comentario a eliminar',
            author: testUser._id,
            post: testPost._id,
        });

        const res = await request(app)
            .delete(`/api/comments/${commentToDelete._id}`)
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Comentario eliminado');
    });
    it('Debe devolver 401 si el comentario no pertenece al usuario', async () => {
        const anotherUser = await User.create({
            name: 'Otro Usuario',
            email: 'other@example.com',
            password: 'password456',
        });
        const anotherToken = jwt.sign({ id: anotherUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const commentToDelete = await Comment.create({
            content: 'Comentario de otro usuario',
            author: testUser._id,
            post: testPost._id,
        });

        const res = await request(app)
            .delete(`/api/comments/${commentToDelete._id}`)
            .set('Authorization', `Bearer ${anotherToken}`);
        
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toBe('No estás autorizado para eliminar este comentario');
    });
    it('Debe devolver 404 si el comentario no existe', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .delete(`/api/comments/${fakeId}`)
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toBe('Comentario no encontrado');
    });
});