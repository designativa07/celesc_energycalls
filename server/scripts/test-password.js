const sequelize = require('../config/database');
const { User } = require('../models');
const bcrypt = require('bcrypt');

async function testPassword() {
  try {
    // Verificar conexão com o banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    // Buscar o usuário admin
    const admin = await User.findOne({ where: { email: 'admin@celesc.com.br' } });
    if (!admin) {
      console.log('Usuário admin não encontrado!');
      process.exit(1);
    }
    
    console.log('Usuário encontrado:', {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      password_hash: admin.password.substring(0, 20) + '...' // Exibe apenas parte do hash por segurança
    });
    
    // Testar senha diretamente com bcrypt
    const testPassword = 'admin123';
    console.log('Testando senha:', testPassword);
    
    // Método 1: Usando o método do modelo
    const validPasswordModel = await admin.checkPassword(testPassword);
    console.log('Resultado da verificação usando método do modelo:', validPasswordModel);
    
    // Método 2: Usando bcrypt diretamente
    const validPasswordDirect = await bcrypt.compare(testPassword, admin.password);
    console.log('Resultado da verificação usando bcrypt diretamente:', validPasswordDirect);
    
    // Criar um novo hash para a senha para testar
    const newHash = await bcrypt.hash(testPassword, 10);
    console.log('Novo hash para a mesma senha:', newHash.substring(0, 20) + '...');
    
    // Comparar o novo hash
    const compareNewHash = await bcrypt.compare(testPassword, newHash);
    console.log('Verificação do novo hash:', compareNewHash);
    
    // Atualizar a senha do usuário admin
    console.log('Atualizando senha do usuário admin...');
    
    admin.password = await bcrypt.hash(testPassword, 10);
    await admin.save();
    
    console.log('Senha atualizada com sucesso!');
    console.log('Nova senha:', testPassword);
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao testar senha:', error);
    process.exit(1);
  }
}

// Executar a função
testPassword(); 