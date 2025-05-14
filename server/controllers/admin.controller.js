const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

// Migração para adicionar coluna accessCode à tabela Counterparts
exports.migrateAddAccessCode = async (req, res) => {
  try {
    // Verificar se a coluna existe
    const checkColumn = await sequelize.query(
      `SELECT column_name FROM information_schema.columns 
       WHERE table_name = 'Counterparts' AND column_name = 'accessCode'`,
      { type: QueryTypes.SELECT }
    );

    if (checkColumn.length === 0) {
      // Adicionar a coluna se não existir
      await sequelize.query(
        `ALTER TABLE "Counterparts" ADD COLUMN "accessCode" VARCHAR(255) NULL`
      );
      
      return res.status(200).json({ 
        success: true, 
        message: 'Coluna accessCode adicionada com sucesso à tabela Counterparts' 
      });
    } else {
      return res.status(200).json({ 
        success: true, 
        message: 'Coluna accessCode já existe na tabela Counterparts' 
      });
    }
  } catch (error) {
    console.error('Erro ao migrar banco de dados:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro ao executar migração', 
      error: error.message 
    });
  }
}; 