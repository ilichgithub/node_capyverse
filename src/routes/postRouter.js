const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const postCtrl = require('../controllers/postController');

/**
 * @swagger
 * /posts:
 *  get:
 *      summary: Obtener todos los posts
 *      tags: [Posts]
 *      responses:
 *          200:
 *              description: Lista de posts obtenida exitosamente.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                  items:
 *                      $ref: '#/components/schemas/Post'
 */
router.get('/', postCtrl.getPosts);


/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Obtener un post por ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del post
 *     responses:
 *       200:
 *         description: Post encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post no encontrado
 */
router.get('/:id', postCtrl.getPostById);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crear un nuevo post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       201:
 *         description: Post creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */
router.post('/', auth, postCtrl.createPost);


/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Actualizar un post por ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       200:
 *         description: Post actualizado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Post no encontrado
 */
router.put('/:id', auth, postCtrl.updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Eliminar un post por ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del post
 *     responses:
 *       200:
 *         description: Post eliminado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Post no encontrado
 */
router.delete('/:id', auth, postCtrl.deletePost);

module.exports = router;