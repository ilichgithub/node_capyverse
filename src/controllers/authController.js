const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Función auxiliar para generar el token
const generateToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'El usuario ya existe' });
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Datos de usuario inválidos' });
  }
};

// @desc    Autenticar un usuario y obtener un token
// @route   POST /api/auth/login
exports.authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Email o contraseña incorrecta' });
  }
};