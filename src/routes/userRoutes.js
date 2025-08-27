const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/userController');
const protect = require('../middlewares/authMiddleware');

router.get('/', protect, getUsers);
router.post('/', protect, createUser);

module.exports = router;