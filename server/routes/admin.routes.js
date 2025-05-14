const express = require('express');
const adminController = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Rota para adicionar a coluna accessCode à tabela Counterparts
router.post('/migrate/add-access-code', adminController.migrateAddAccessCode);

module.exports = router; 