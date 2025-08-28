const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const commentCtrl = require('../controllers/commentController');

/**
 * @swagger
 * /comments/{postId}:
 *   get:
 *     summary: Obtener comentarios de un post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del post
 *     responses:
 *       200:
 *         description: Lista de comentarios
 */
router.get('/:postId', commentCtrl.getCommentsByPost);

/**
 * @swagger
 * /comments/{postId}:
 *   post:
 *     summary: Crear un comentario en un post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Comentario creado
 *       400:
 *         description: Error de validación
 */
router.post('/:postId', auth, commentCtrl.createComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Eliminar un comentario por ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario eliminado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Comentario no encontrado
 */
router.delete('/:id', auth, commentCtrl.deleteComment);

module.exports = router;