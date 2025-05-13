module.exports = {
  // Variáveis do Banco de Dados
  database: {
    name: 'energycalls',
    user: 'energycalls',
    password: 'MKHV392AMAbegHH',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
  },
  
  // Variáveis da Aplicação
  app: {
    port: 5000,
    environment: 'development'
  },
  
  // Variáveis de Segurança
  security: {
    jwtSecret: 'celesc_energy_calls_secure_token_2025',
    jwtExpiresIn: '1d'
  }
}; 