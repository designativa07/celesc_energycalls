const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');

// Registrar um novo usuário
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    
    // Verificar se o e-mail já está em uso
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Este e-mail já está em uso' });
    }
    
    // Criar o novo usuário
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      department
    });
    
    // Retornar os dados do usuário sem a senha
    const userData = { ...user.get() };
    delete userData.password;
    
    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar o usuário pelo e-mail
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    // Verificar se o usuário está ativo
    if (!user.active) {
      return res.status(403).json({ message: 'Usuário desativado. Entre em contato com o administrador.' });
    }
    
    // Verificar a senha
    const isPasswordValid = await user.checkPassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.security.jwtSecret,
      { expiresIn: config.security.jwtExpiresIn }
    );
    
    // Retornar os dados do usuário sem a senha
    const userData = { ...user.get() };
    delete userData.password;
    
    res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao realizar login', error: error.message });
  }
};

// Obter informações do usuário atual
exports.getCurrentUser = async (req, res) => {
  try {
    const userData = { ...req.user.get() };
    delete userData.password;
    
    res.status(200).json({
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter dados do usuário', error: error.message });
  }
}; 