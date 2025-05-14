const express = require('express');
const counterpartController = require('../controllers/counterpart.controller');
const { verifyToken, isManagerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Rotas protegidas - Requerem autenticação
// router.use(verifyToken);  // Temporarily commented for troubleshooting

// Obter contagem de contrapartes
router.get('/count', counterpartController.countCounterparts);

// Obter todas as contrapartes
router.get('/', counterpartController.getAllCounterparts);

// Obter contraparte por ID
router.get('/:id', counterpartController.getCounterpartById);

// Rotas protegidas - Requerem autenticação e permissão de gerente ou admin
// router.use(isManagerOrAdmin);  // Temporarily commented for troubleshooting

// Criar nova contraparte
router.post('/', counterpartController.createCounterpart);

// Atualizar contraparte
router.put('/:id', counterpartController.updateCounterpart);

// Desativar contraparte
router.delete('/:id', counterpartController.deleteCounterpart);

// Homologar contraparte
router.patch('/:id/homologate', counterpartController.homologateCounterpart);

module.exports = router; 