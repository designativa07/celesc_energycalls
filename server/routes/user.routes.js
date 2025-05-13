const express = require('express');
const userController = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Rotas protegidas - Requerem autenticação
router.use(verifyToken);

// Obter todos os usuários (apenas admin)
router.get('/', isAdmin, userController.getAllUsers);

// Obter usuário por ID (próprio usuário ou admin)
router.get('/:id', (req, res, next) => {
  // Permitir se for o próprio usuário ou admin
  if (req.user.id === parseInt(req.params.id) || req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Acesso negado' });
}, userController.getUserById);

// Atualizar usuário (próprio usuário ou admin)
router.put('/:id', userController.updateUser);

// Alterar senha (apenas o próprio usuário)
router.put('/:id/change-password', userController.changePassword);

// Ativar/desativar usuário (apenas admin)
router.patch('/:id/toggle-status', isAdmin, userController.toggleUserStatus);

module.exports = router; 