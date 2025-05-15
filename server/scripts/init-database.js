const sequelize = require('../config/database');
const { User, Counterpart, EnergyCall, Proposal } = require('../models');
const bcrypt = require('bcrypt');

async function initDatabase() {
  try {
    console.log('Iniciando sincronização do banco de dados...');
    
    // Força a criação de todas as tabelas (CUIDADO: isso apaga dados existentes)
    // Use { force: false } se quiser preservar dados existentes
    await sequelize.sync({ force: true });
    
    console.log('Banco de dados sincronizado com sucesso!');
    
    // Criar usuário administrador padrão
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@celesc.com.br',
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log(`Usuário administrador criado com sucesso! ID: ${admin.id}`);
    console.log('Credenciais iniciais:');
    console.log('Email: admin@celesc.com.br');
    console.log('Senha: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
}

// Executar a função
initDatabase(); 