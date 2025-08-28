const express = require('express');
const router = express.Router();
const { registerUser, authUser } = require('../controllers/authController');

/**
 * @swagger
 * tags:
 * name: Auth
 * description: Rutas para el registro y login de usuarios
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /auth/login:
 *  post:
 *      summary: Autenticar un usuario y obtener un token JWT
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - email
 *                          - password
 *                      properties:
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          200:
 *              description: Login exitoso, devuelve el token.
 *          401:
 *              description: Email o contraseña incorrecta.
 */
router.post('/login', authUser);

module.exports = router;