const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { // Añadimos el campo de contraseña
    type: String,
    required: true,
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
 },
}, {
  timestamps: true, // Agrega createdAt y updatedAt
});

// Método para comparar la contraseña ingresada con la hasheada
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware de Mongoose: hasheamos la contraseña antes de guardarla
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) { // Si la contraseña no fue modificada, salimos
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);