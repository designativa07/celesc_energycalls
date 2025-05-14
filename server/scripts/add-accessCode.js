const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

async function addAccessCodeColumn() {
  try {
    console.log('Verificando se a coluna accessCode existe...');
    
    // Verificar se a coluna existe
    const checkColumn = await sequelize.query(
      `SELECT column_name FROM information_schema.columns 
       WHERE table_name = 'Counterparts' AND column_name = 'accessCode'`,
      { type: QueryTypes.SELECT }
    );

    if (checkColumn.length === 0) {
      console.log('Coluna accessCode não encontrada. Adicionando...');
      
      // Adicionar a coluna se não existir
      await sequelize.query(
        `ALTER TABLE "Counterparts" ADD COLUMN "accessCode" VARCHAR(255) NULL`
      );
      
      console.log('Coluna accessCode adicionada com sucesso!');
    } else {
      console.log('Coluna accessCode já existe na tabela.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao migrar banco de dados:', error);
    process.exit(1);
  }
}

// Executar a função
addAccessCodeColumn(); 