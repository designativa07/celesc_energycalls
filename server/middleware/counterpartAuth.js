const jwt = require('jsonwebtoken');
const { Counterpart } = require('../models');

// Middleware para autenticação de contrapartes
const counterpartAuth = async (req, res, next) => {
  try {
    // Verificar se o cabeçalho de autorização está presente
    const authHeader = req.headers['counterpart-authorization'];
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'Token de autenticação não fornecido' 
      });
    }
    
    // Extrair o token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Formato de token inválido' 
      });
    }
    
    // Verificar e decodificar o token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'energycalls-secret'
    );
    
    // Verificar se o token é de uma contraparte
    if (decoded.type !== 'counterpart') {
      return res.status(403).json({ 
        message: 'Token inválido para acesso de contraparte' 
      });
    }
    
    // Verificar se a contraparte existe no banco de dados
    const counterpart = await Counterpart.findByPk(decoded.id);
    
    if (!counterpart) {
      return res.status(404).json({ 
        message: 'Contraparte não encontrada' 
      });
    }
    
    // Verificar se a contraparte está ativa
    if (!counterpart.active) {
      return res.status(403).json({ 
        message: 'Esta contraparte está desativada' 
      });
    }
    
    // Verificar se a contraparte está homologada
    if (!counterpart.homologated) {
      return res.status(403).json({ 
        message: 'Esta contraparte não está homologada' 
      });
    }
    
    // Adicionar a contraparte à requisição
    req.counterpart = decoded;
    
    // Passar para o próximo middleware
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expirado' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Token inválido' 
      });
    }
    
    res.status(500).json({ 
      message: 'Erro de autenticação', 
      error: error.message 
    });
  }
};

module.exports = counterpartAuth; 