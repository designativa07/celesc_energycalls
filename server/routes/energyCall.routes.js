const express = require('express');
const energyCallController = require('../controllers/energyCall.controller');
const { verifyToken, isManagerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Middleware de autenticação condicional - Aplicado em produção, ignorado em desenvolvimento
const conditionalAuth = (req, res, next) => {
  // Se estiver em produção, usa verificação de token
  if (process.env.NODE_ENV === 'production') {
    return verifyToken(req, res, next);
  }
  // Em desenvolvimento, adiciona um usuário mock para testes
  if (!req.user) {
    req.user = { 
      id: 1, 
      name: 'Admin Teste', 
      email: 'admin@teste.com',
      role: 'admin'
    };
  }
  next();
};

// Middleware de permissão condicional
const conditionalPermission = (req, res, next) => {
  // Se estiver em produção, verifica permissões
  if (process.env.NODE_ENV === 'production') {
    return isManagerOrAdmin(req, res, next);
  }
  // Em desenvolvimento, adiciona role de admin se não existir
  if (req.user && !req.user.role) {
    req.user.role = 'admin';
  }
  next();
};

// Rota de teste - remover depois
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Teste de API funcionando!' });
});

// Aplicar autenticação em todas as rotas
router.use(conditionalAuth);

// Obter estatísticas de chamadas
router.get('/stats', energyCallController.getCallStats);

// Obter todas as chamadas de energia
router.get('/', energyCallController.getAllEnergyCalls);

// Obter chamada de energia por ID
router.get('/:id', energyCallController.getEnergyCallById);

// Gerar relatório de chamada de energia
router.get('/:id/report', energyCallController.generateCallReport);

// Aplicar verificação de permissões para rotas de modificação
router.use(conditionalPermission);

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