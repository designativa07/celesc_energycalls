const { User } = require('../models');
const { Op } = require('sequelize');

// Obter todos os usuários
exports.getAllUsers = async (req, res) => {
  try {
    const { search, role, active } = req.query;
    
    let whereCondition = {};
    
    // Filtro de pesquisa
    if (search) {
      whereCondition = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { department: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }
    
    // Filtro por cargo
    if (role) {
      whereCondition.role = role;
    }
    
    // Filtro por status ativo
    if (active !== undefined) {
      whereCondition.active = active === 'true';
    }
    
    const users = await User.findAll({
      where: whereCondition,
      attributes: { exclude: ['password'] },
      order: [['name', 'ASC']]
    });
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar usuários', 
      error: error.message 
    });
  }
};

// Obter usuário por ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar usuário', 
      error: error.message 
    });
  }
};

// Atualizar usuário
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, role } = req.body;
    
    // Verificar se o usuário existe
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Verificar se o usuário tem permissão para atualizar
    // Apenas o próprio usuário ou administradores podem atualizar perfis
    if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Você não tem permissão para atualizar este usuário' 
      });
    }
    
    // Verificar se o novo email já está em uso
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ 
        where: { 
          email,
          id: { [Op.ne]: id }
        } 
      });
      
      if (emailExists) {
        return res.status(400).json({ message: 'Este e-mail já está em uso por outro usuário' });
      }
    }
    
    // Apenas administradores podem alterar cargos
    if (role && role !== user.role && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Apenas administradores podem alterar cargos' 
      });
    }
    
    await user.update({
      name: name || user.name,
      email: email || user.email,
      department: department || user.department,
      role: (role && req.user.role === 'admin') ? role : user.role
    });
    
    // Retornar o usuário sem a senha
    const userData = { ...user.get() };
    delete userData.password;
    
    res.status(200).json({
      message: 'Usuário atualizado com sucesso',
      user: userData
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao atualizar usuário', 
      error: error.message 
    });
  }
};

// Alterar senha
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    // Verificar se o usuário existe
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Verificar se o usuário tem permissão para alterar a senha
    // Apenas o próprio usuário pode alterar sua senha
    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({ 
        message: 'Você não tem permissão para alterar a senha deste usuário' 
      });
    }
    
    // Verificar se a senha atual está correta
    const isPasswordValid = await user.checkPassword(currentPassword);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha atual incorreta' });
    }
    
    // Verificar se a nova senha é forte o suficiente
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'A nova senha deve ter pelo menos 6 caracteres' });
    }
    
    // Atualizar a senha
    await user.update({ password: newPassword });
    
    res.status(200).json({
      message: 'Senha alterada com sucesso'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao alterar senha', 
      error: error.message 
    });
  }
};

// Ativar/desativar usuário (apenas administradores)
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    
    // Verificar se o usuário existe
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Verificar se o usuário tem permissão de administrador
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Apenas administradores podem ativar/desativar usuários' 
      });
    }
    
    // Não permitir desativar o próprio usuário
    if (req.user.id === parseInt(id) && active === false) {
      return res.status(400).json({ 
        message: 'Você não pode desativar sua própria conta' 
      });
    }
    
    await user.update({ active: active });
    
    // Retornar o usuário sem a senha
    const userData = { ...user.get() };
    delete userData.password;
    
    res.status(200).json({
      message: `Usuário ${active ? 'ativado' : 'desativado'} com sucesso`,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao alterar status do usuário', 
      error: error.message 
    });
  }
}; 