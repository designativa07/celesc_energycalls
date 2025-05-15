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
    
    // MODIFICAÇÃO: Remover usuário admin existente (se houver)
    await User.destroy({ where: { role: 'admin' } });
    
    // Criar usuário administrador padrão
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@celesc.com.br',
      password: hashedPassword,
      role: 'admin'
    });
    
    res.status(200).json({ 
      message: 'Banco de dados inicializado e usuário admin recriado com sucesso',
      adminId: admin.id,
      credentials: {
        email: 'admin@celesc.com.br',
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    res.status(500).json({ 
      message: 'Erro ao inicializar banco de dados', 
      error: error.message 
    });
  }
});

// Adicionar rota para redefinir senha do administrador
router.get('/reset-admin-password', async (req, res) => {
  try {
    // Encontrar o primeiro usuário com papel de admin
    const admin = await User.findOne({ where: { role: 'admin' } });
    
    if (!admin) {
      return res.status(404).json({ message: 'Usuário administrador não encontrado' });
    }
    
    // Redefinir a senha
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await admin.update({ password: hashedPassword });
    
    res.status(200).json({ 
      message: 'Senha do administrador redefinida com sucesso',
      adminId: admin.id,
      credentials: {
        email: admin.email,
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ 
      message: 'Erro ao redefinir senha', 
      error: error.message 
    });
  }
});

// Adicionar rota para criar usuário admin com credenciais específicas
router.get('/create-specific-admin', async (req, res) => {
  try {
    // Verificar se as tabelas existem (sincroniza sem destruir dados)
    await sequelize.sync({ force: false });
    
    // MODIFICAÇÃO: Remover usuário admin existente (se houver)
    await User.destroy({ where: { email: 'admin@celesc.com.br' } });
    
    // Criar usuário administrador com credenciais específicas
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Administrador CELESC',
      email: 'admin@celesc.com.br',
      password: hashedPassword,
      role: 'admin'
    });
    
    res.status(200).json({ 
      message: 'Usuário admin criado com sucesso',
      adminId: admin.id,
      credentials: {
        email: 'admin@celesc.com.br',
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
    res.status(500).json({ 
      message: 'Erro ao criar usuário admin', 
      error: error.message 
    });
  }
});

// Adicionar rota para forçar a atualização da senha do administrador diretamente no banco
router.get('/force-update-admin-password', async (req, res) => {
  try {
    // Encontrar o usuário administrador
    const admin = await User.findOne({ where: { email: 'admin@celesc.com.br' } });
    
    if (!admin) {
      return res.status(404).json({ message: 'Usuário administrador não encontrado' });
    }
    
    // Gerar hash diretamente com bcrypt
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Atualizar diretamente no banco de dados para evitar hooks do Sequelize
    await sequelize.query(
      'UPDATE "Users" SET "password" = ? WHERE "id" = ?',
      {
        replacements: [hashedPassword, admin.id],
        type: sequelize.QueryTypes.UPDATE
      }
    );
    
    res.status(200).json({ 
      message: 'Senha do administrador atualizada com sucesso',
      adminId: admin.id,
      email: admin.email,
      passwordUpdated: true
    });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({ 
      message: 'Erro ao atualizar senha', 
      error: error.message 
    });
  }
});

module.exports = router; 