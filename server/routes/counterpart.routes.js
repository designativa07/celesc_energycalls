const express = require('express');
const counterpartController = require('../controllers/counterpart.controller');
const { verifyToken, isManagerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Rotas protegidas - Requerem autenticação
// router.use(verifyToken);  // Comentando temporariamente para teste

// Obter todas as contrapartes
router.get('/', counterpartController.getAllCounterparts);

// Obter contraparte por ID
router.get('/:id', counterpartController.getCounterpartById);

// Rotas protegidas - Requerem autenticação e permissão de gerente ou admin
// router.use(isManagerOrAdmin);  // Comentando temporariamente para teste

// Criar nova contraparte
router.post('/', counterpartController.createCounterpart);

// Atualizar contraparte
router.put('/:id', counterpartController.updateCounterpart);

// Desativar contraparte
router.delete('/:id', counterpartController.deleteCounterpart);

// Homologar contraparte
router.patch('/:id/homologate', counterpartController.homologateCounterpart);

module.exports = router; 