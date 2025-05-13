require('dotenv').config();

module.exports = {
  // Variáveis do Banco de Dados
  database: {
    name: process.env.DB_NAME || 'energycalls',
    user: process.env.DB_USER || 'energycalls',
    password: process.env.DB_PASSWORD || 'MKHV392AMAbegHH',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres'
  },
  
  // Variáveis da Aplicação
  app: {
    port: process.env.PORT || 5000,
    environment: process.env.NODE_ENV || 'development'
  },
  
  // Variáveis de Segurança
  security: {
    jwtSecret: process.env.JWT_SECRET || 'celesc_energy_calls_secure_token_2025',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d'
  }
}; 