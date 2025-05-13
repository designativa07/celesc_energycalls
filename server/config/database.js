const { Sequelize } = require('sequelize');
const config = require('./config');

const { database } = config;

const sequelize = new Sequelize(
  database.name, 
  database.user, 
  database.password, 
  {
    host: database.host,
    dialect: database.dialect,
    port: database.port,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false
  }
);

// Teste de conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
};

testConnection();

module.exports = sequelize; 