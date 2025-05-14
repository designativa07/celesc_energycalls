const { EnergyCall, User, Sequelize } = require('../models');
const sequelize = require('../config/database');

// Função para criar chamada de teste
async function createTestCall() {
  try {
    // Verificar se já existe algum administrador no sistema
    let adminUser = await User.findOne({
      where: {
        role: 'admin'
      }
    });

    // Se não existir um administrador, criar um
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Administrador',
        email: 'admin@energycalls.com',
        password: '$2b$10$ywBeYbzqHPL5Lkk2mfQRN.dL1/TmA9IwkyJBljz.QUPwrUs7qwQ2e', // bcrypt de 'admin123'
        role: 'admin',
        department: 'TI',
        active: true
      });
      console.log('Administrador criado com ID:', adminUser.id);
    }

    // Verificar se já existe alguma chamada no sistema
    const callsCount = await EnergyCall.count();
    if (callsCount > 0) {
      console.log(`Já existem ${callsCount} chamadas no sistema. Não será criada uma chamada de teste.`);
      return;
    }

    // Criar uma chamada de teste
    const now = new Date();
    const testCall = await EnergyCall.create({
      title: 'Chamada de Teste - Compra de Energia',
      type: 'buy',
      energyType: 'conventional',
      amount: 1000,
      startDate: new Date(now.getFullYear(), now.getMonth() + 1, 1), // Mês seguinte, dia 1
      endDate: new Date(now.getFullYear(), now.getMonth() + 2, 1),   // Dois meses depois, dia 1
      deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),   // 7 dias a partir de hoje
      status: 'open',
      description: 'Esta é uma chamada de teste para desenvolvimento do sistema.',
      requirements: 'Requisitos de teste para chamadas de energia.',
      creatorId: adminUser.id,
      isExtraordinary: false
    });

    console.log('Chamada de teste criada com sucesso!');
    console.log('ID da chamada:', testCall.id);
    console.log('Título:', testCall.title);
    console.log('Status:', testCall.status);
    
  } catch (error) {
    console.error('Erro ao criar chamada de teste:', error);
  } finally {
    // Fechar a conexão com o banco de dados
    await sequelize.close();
  }
}

// Executar a função
createTestCall()
  .then(() => {
    console.log('Script concluído');
    process.exit(0);
  })
  .catch(err => {
    console.error('Erro no script:', err);
    process.exit(1);
  }); 