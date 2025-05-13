const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');

// Middleware para verificar se o usuário está autenticado
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, config.security.jwtSecret);
    
    // Buscar usuário no banco de dados
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }
    
    if (!user.active) {
      return res.status(403).json({ message: 'Usuário desativado' });
    }
    
    // Anexar o usuário ao objeto de requisição
    req.user = user;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    
    return res.status(500).json({ message: 'Erro ao autenticar usuário', error: error.message });
  }
};

// Middleware para verificar se o usuário tem permissão de administrador
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  
  return res.status(403).json({ message: 'Acesso negado: permissão de administrador necessária' });
};

// Middleware para verificar se o usuário é gerente ou administrador
const isManagerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'manager' || req.user.role === 'admin')) {
    return next();
  }
  
  return res.status(403).json({ message: 'Acesso negado: permissão de gerente ou administrador necessária' });
};

module.exports = {
  verifyToken,
  isAdmin,
  isManagerOrAdmin
}; 