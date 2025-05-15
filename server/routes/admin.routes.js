const express = require('express');
const adminController = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');
const sequelize = require('../config/database');
const { User } = require('../models');
const bcrypt = require('bcrypt');

const router = express.Router();

// Rota para adicionar a coluna accessCode à tabela Counterparts
router.post('/migrate/add-access-code', adminController.migrateAddAccessCode);

// Adicionar rota para inicializar banco de dados
router.get('/init-database', async (req, res) => {
  try {
    // Sincronizar modelos com o banco de dados
    await sequelize.sync({ force: false }); // use { force: true } para recriar as tabelas (CUIDADO: apaga dados)
    
    // Verificar se já existe um usuário administrador
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    
    if (!adminExists) {
      // Criar usuário administrador padrão
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = await User.create({
        name: 'Administrador',
        email: 'admin@exemplo.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      res.status(200).json({ 
        message: 'Banco de dados inicializado e usuário admin criado com sucesso',
        adminId: admin.id,
        credentials: {
          email: 'admin@exemplo.com',
          password: 'admin123'
        }
      });
    } else {
      res.status(200).json({ 
        message: 'Banco de dados inicializado. Um usuário admin já existe.',
        adminExists: true
      });
    }
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    res.status(500).json({ 
      message: 'Erro ao inicializar banco de dados', 
      error: error.message 
    });
  }
});

module.exports = router; 