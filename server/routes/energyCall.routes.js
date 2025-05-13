const express = require('express');
const energyCallController = require('../controllers/energyCall.controller');
const { verifyToken, isManagerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Rotas protegidas - Requerem autenticação
// router.use(verifyToken);  // Comentando temporariamente para teste

// Obter todas as chamadas de energia
router.get('/', energyCallController.getAllEnergyCalls);

// Obter chamada de energia por ID
router.get('/:id', energyCallController.getEnergyCallById);

// Gerar relatório de chamada de energia
router.get('/:id/report', energyCallController.generateCallReport);

// Rotas protegidas - Requerem autenticação e permissão de gerente ou admin
// router.use(isManagerOrAdmin);  // Comentando temporariamente para teste

// Criar nova chamada de energia
router.post('/', energyCallController.createEnergyCall);

// Atualizar chamada de energia
router.put('/:id', energyCallController.updateEnergyCall);

// Publicar chamada de energia
router.patch('/:id/publish', energyCallController.publishEnergyCall);

// Fechar chamada de energia
router.patch('/:id/close', energyCallController.closeEnergyCall);

// Cancelar chamada de energia
router.patch('/:id/cancel', energyCallController.cancelEnergyCall);

// Registrar chamada na CCEE
router.patch('/:id/register-ccee', energyCallController.registerInCCEE);

module.exports = router; 