const express = require('express');
const router = express.Router();
const counterpartPortalController = require('../controllers/counterpart-portal.controller');
const counterpartAuth = require('../middleware/counterpartAuth');

// Todas as rotas requerem autenticação da contraparte
router.use(counterpartAuth);

// Rotas para chamadas de energia
router.get('/calls', counterpartPortalController.getAvailableCalls);
router.get('/calls/:id', counterpartPortalController.getCallDetails);

// Rotas para propostas
router.post('/proposals', counterpartPortalController.submitProposal);
router.get('/my-proposals', counterpartPortalController.getMyProposals);

module.exports = router; 