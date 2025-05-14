const express = require('express');
const router = express.Router();
const counterpartAuthController = require('../controllers/counterpart-auth.controller');
const counterpartAuth = require('../middleware/counterpartAuth');
const { verifyToken } = require('../middleware/auth');

// Rota para login da contraparte
router.post('/login', counterpartAuthController.loginCounterpart);

// Rota para verificar autenticação da contraparte
router.get('/me', counterpartAuth, counterpartAuthController.getCounterpartProfile);

// Rota para gerar código de acesso (requer autenticação administrativa)
router.post('/:id/generate-access-code', verifyToken, counterpartAuthController.generateAccessCode);

module.exports = router; 