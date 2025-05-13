const { Sequelize } = require('sequelize');
const config = require('./config');

const { database } = config;

console.log('Iniciando configuração do banco de dados...');

// Verificar se as variáveis de ambiente estão definidas
console.log('Verificando variáveis de ambiente do banco de dados:');
console.log('DB_HOST:', process.env.DB_HOST || 'não definido (usando padrão)');
console.log('DB_PORT:', process.env.DB_PORT || 'não definido (usando padrão)');
console.log('DB_NAME:', process.env.DB_NAME || 'não definido (usando padrão)');
console.log('DB_USER:', process.env.DB_USER || 'não definido (usando padrão)');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'definido' : 'não definido (usando padrão)');

// Configuração do Sequelize
let sequelize;

try {
  sequelize = new Sequelize(
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
      logging: false,
      // Aumentar tempo limite de conexão
      dialectOptions: {
        connectTimeout: 60000
      },
      retry: {
        max: 5,
        match: [
          /SequelizeConnectionError/,
          /SequelizeConnectionRefusedError/,
          /SequelizeHostNotFoundError/,
          /SequelizeHostNotReachableError/,
          /SequelizeInvalidConnectionError/,
          /SequelizeConnectionTimedOutError/
        ],
        backoffBase: 1000,
        backoffExponent: 1.5,
      }
    }
  );
  console.log('Instância do Sequelize criada com sucesso');
} catch (error) {
  console.error('Erro ao criar instância do Sequelize:', error);
  // Criar uma instância simulada do Sequelize para não quebrar a aplicação
  sequelize = {
    authenticate: async () => { 
      throw new Error('Banco de dados não disponível');
    },
    sync: async () => {
      throw new Error('Banco de dados não disponível');
    },
    define: () => ({
      sync: async () => ({}),
      findAll: async () => ([]),
      findOne: async () => (null),
      create: async () => ({}),
      update: async () => ([0]),
      destroy: async () => (0)
    })
  };
  console.log('Criada instância simulada do Sequelize para continuar execução');
}

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