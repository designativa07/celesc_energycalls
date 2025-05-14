const { EnergyCall, User } = require('../models');
const sequelize = require('../config/database');

async function forceCreateCall() {
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
    } else {
      console.log('Administrador encontrado com ID:', adminUser.id);
    }

    // Criar uma nova chamada de energia, mesmo que já existam outras
    const now = new Date();
    const newCall = await EnergyCall.create({
      title: 'Chamada de Teste Forçada',
      type: 'sell',
      energyType: 'incentivized',
      amount: 2000,
      startDate: new Date(now.getFullYear(), now.getMonth() + 1, 15), // Mês seguinte, dia 15
      endDate: new Date(now.getFullYear(), now.getMonth() + 3, 15),   // Três meses depois, dia 15
      deadline: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),   // 14 dias a partir de hoje
      status: 'open',
      description: 'Esta é uma chamada de teste forçada para desenvolvimento do sistema.',
      requirements: 'Requisitos de teste para chamadas de energia (venda).',
      creatorId: adminUser.id,
      isExtraordinary: true
    });

    console.log('Nova chamada criada com sucesso!');
    console.log('ID da chamada:', newCall.id);
    console.log('Título:', newCall.title);
    console.log('Tipo:', newCall.type);
    console.log('Status:', newCall.status);
    
  } catch (error) {
    console.error('Erro ao criar chamada de teste:', error);
  } finally {
    await sequelize.close();
  }
}

forceCreateCall()
  .then(() => {
    console.log('Script concluído');
    process.exit(0);
  })
  .catch(err => {
    console.error('Erro no script:', err);
    process.exit(1);
  }); 