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
    console.log('Login attempt with:', { email: req.body.email });
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Login failed: missing email or password');
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }
    
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('Login failed: user not found');
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    console.log('User found:', { id: user.id, role: user.role });
    
    // Verificar a senha
    const validPassword = await user.checkPassword(password);
    console.log('Password validation result:', validPassword);
    
    if (!validPassword) {
      console.log('Login failed: invalid password');
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.security.jwtSecret,
      { expiresIn: config.security.jwtExpiresIn }
    );
    
    console.log('Login successful for user ID:', user.id);
    
    // Se chegou até aqui, autenticação foi bem-sucedida
    res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
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