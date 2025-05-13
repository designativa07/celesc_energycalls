const express = require('express');
const proposalController = require('../controllers/proposal.controller');
const { verifyToken, isManagerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Rotas protegidas - Requerem autenticação
router.use(verifyToken);

// Obter todas as propostas
router.get('/', proposalController.getAllProposals);

// Obter proposta por ID
router.get('/:id', proposalController.getProposalById);

// Obter propostas por chamada de energia
router.get('/energy-call/:energyCallId', proposalController.getProposalsByEnergyCall);

// Obter propostas por contraparte
router.get('/counterpart/:counterpartId', proposalController.getProposalsByCounterpart);

// Criar nova proposta
router.post('/', proposalController.createProposal);

// Rotas protegidas - Requerem autenticação e permissão de gerente ou admin
router.use(isManagerOrAdmin);

// Atualizar status de proposta (aceitar/rejeitar)
router.patch('/:id/status', proposalController.updateProposalStatus);

module.exports = router; 