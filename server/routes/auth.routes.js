const express = require('express');
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Rotas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rotas protegidas
router.get('/me', verifyToken, authController.getCurrentUser);

module.exports = router; 