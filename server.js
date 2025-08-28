// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRouter');
const authRoutes = require('./src/routes/authRouter');
const postRoutes = require('./src/routes/postRouter');
const commentRoutes = require('./src/routes/commentRouter');

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // Middleware para parsear JSON

// Definir una ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando...');
});

// Importar y usar las rutas de la API
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
// Exportar la instancia de la aplicación para los tests
module.exports = { app, server };