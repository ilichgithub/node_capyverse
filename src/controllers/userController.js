const User = require('../models/userModel');

// @desc    Obtener todos los usuarios
// @route   GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Crear un nuevo usuario
// @route   POST /api/users
exports.createUser = async (req, res) => {
  const { nombre, email } = req.body;
  if (!nombre || !email) {
    return res.status(400).json({ message: 'Por favor, añade todos los campos' });
  }
  try {
    const user = await User.create({ nombre, email });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'El correo ya existe' });
  }
};