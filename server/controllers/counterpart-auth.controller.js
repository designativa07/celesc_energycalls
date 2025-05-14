const { Counterpart } = require('../models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Gerar código de acesso aleatório
exports.generateAccessCode = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se a contraparte existe
    const counterpart = await Counterpart.findByPk(id);
    
    if (!counterpart) {
      return res.status(404).json({ message: 'Contraparte não encontrada' });
    }
    
    // Gerar código de acesso aleatório (6 dígitos)
    const accessCode = crypto.randomInt(100000, 999999).toString();
    
    // Salvar o código de acesso no banco de dados
    await counterpart.update({ accessCode });
    
    res.status(200).json({
      message: 'Código de acesso gerado com sucesso',
      accessCode
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao gerar código de acesso', 
      error: error.message 
    });
  }
};

// Login da contraparte
exports.loginCounterpart = async (req, res) => {
  try {
    const { cnpj, accessCode } = req.body;
    
    // Validar campos obrigatórios
    if (!cnpj || !accessCode) {
      return res.status(400).json({ 
        message: 'CNPJ e código de acesso são obrigatórios' 
      });
    }
    
    // Buscar contraparte pelo CNPJ
    const counterpart = await Counterpart.findOne({
      where: { cnpj }
    });
    
    // Verificar se a contraparte existe
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
    
    // Verificar se o código de acesso está correto
    if (counterpart.accessCode !== accessCode) {
      return res.status(401).json({ 
        message: 'Código de acesso inválido' 
      });
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: counterpart.id,
        cnpj: counterpart.cnpj,
        companyName: counterpart.companyName,
        type: 'counterpart'
      },
      process.env.JWT_SECRET || 'energycalls-secret',
      { expiresIn: '24h' }
    );
    
    // Retornar dados da contraparte e token
    res.status(200).json({
      message: 'Login realizado com sucesso',
      counterpart: {
        id: counterpart.id,
        companyName: counterpart.companyName,
        cnpj: counterpart.cnpj,
        contactName: counterpart.contactName,
        email: counterpart.email
      },
      token
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro no login da contraparte', 
      error: error.message 
    });
  }
};

// Verificar autenticação da contraparte
exports.getCounterpartProfile = async (req, res) => {
  try {
    // O middleware já verifica a autenticação, então req.counterpart existe
    const counterpart = await Counterpart.findByPk(req.counterpart.id, {
      attributes: [
        'id', 
        'companyName', 
        'cnpj', 
        'contactName', 
        'email', 
        'phone', 
        'active', 
        'homologated'
      ]
    });
    
    if (!counterpart) {
      return res.status(404).json({ message: 'Contraparte não encontrada' });
    }
    
    res.status(200).json({ counterpart });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao obter perfil da contraparte', 
      error: error.message 
    });
  }
}; 