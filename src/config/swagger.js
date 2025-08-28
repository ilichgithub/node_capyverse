const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CapyVerse API',
      version: '1.0.0',
      description: 'Documentación interactiva de la API para CapyVerse',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Servidor local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
        schemas: {
            Post: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    author: { type: 'string', description: 'ID del usuario que creó el post' },
                    title: { type: 'string' },
                    content: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                }
            },
            PostInput: {
                type: 'object',
                required: ['title', 'content'],
                properties: {
                    title: { type: 'string' },
                    content: { type: 'string' },
                }
            },
            Comment: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    post: { type: 'string', description: 'ID del post al que pertenece el comentario' },
                    author: { type: 'string', description: 'ID del usuario que hizo el comentario' },
                    content: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                }
            },
            CommentInput: {
                type: 'object',
                required: ['text'],
                properties: {
                    text: { type: 'string' },
                }
            }
        }
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'], // Aquí Swagger buscará anotaciones
};

module.exports = swaggerJSDoc(options);