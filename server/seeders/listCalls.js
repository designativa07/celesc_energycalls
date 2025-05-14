const { EnergyCall, User } = require('../models');
const sequelize = require('../config/database');

async function listCalls() {
  try {
    const calls = await EnergyCall.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    console.log(`Total de chamadas: ${calls.length}`);
    
    if (calls.length === 0) {
      console.log('Não existem chamadas no sistema.');
      return;
    }
    
    calls.forEach(call => {
      console.log('----------------------------------');
      console.log(`ID: ${call.id}`);
      console.log(`Título: ${call.title}`);
      console.log(`Tipo: ${call.type}`);
      console.log(`Status: ${call.status}`);
      console.log(`Criada em: ${call.createdAt}`);
      console.log(`Criador: ${call.creator ? call.creator.name : 'Não informado'}`);
    });
    console.log('----------------------------------');
    
  } catch (error) {
    console.error('Erro ao listar chamadas:', error);
  } finally {
    await sequelize.close();
  }
}

listCalls()
  .then(() => {
    console.log('Script concluído');
    process.exit(0);
  })
  .catch(err => {
    console.error('Erro no script:', err);
    process.exit(1);
  }); 