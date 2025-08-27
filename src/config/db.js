const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    let dbUri;
    // Usa la base de datos de prueba si estamos en el entorno de testing
    if (process.env.NODE_ENV === 'test') {
      dbUri = process.env.MONGO_URI_TEST;
    } else {
      // De lo contrario, usa la base de datos de desarrollo/producción
      dbUri = process.env.MONGO_URI;
    }
    const conn = await mongoose.connect(dbUri);
    console.log(`MongoDB Conectada: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
module.exports = connectDB;