const { server } = require('../server');
const mongoose = require('mongoose');
const User = require('../src/models/userModel');

// --- Prepara y limpia la base de datos de prueba ---
beforeAll(async () => {
  // Conectar a una base de datos de prueba, si usas una diferente
  // await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterEach(async () => {
  // Limpia la colección de usuarios después de cada test
  await User.deleteMany();
});

afterAll(async () => {
  // Desconecta la base de datos al finalizar
  await mongoose.connection.close();
  // 2. Cierra el servidor para que Jest pueda salir limpiamente
  await new Promise(resolve => server.close(resolve));
});
