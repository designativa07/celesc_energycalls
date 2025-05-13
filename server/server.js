const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const sequelize = require('./config/database');

// Logs para depuração na inicialização
console.log('========= INICIANDO SERVIDOR =========');
console.log('Ambiente:', process.env.NODE_ENV);
console.log('Porta:', process.env.PORT);
console.log('Diretório do servidor:', __dirname);
console.log('Configuração do banco de dados:', {
  host: config.database.host,
  port: config.database.port,
  name: config.database.name,
  user: config.database.user,
  dialect: config.database.dialect
});

// Importação dos modelos
require('./models');

// Inicialização do Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importação de rotas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const energyCallRoutes = require('./routes/energyCall.routes');
const proposalRoutes = require('./routes/proposal.routes');
const counterpartRoutes = require('./routes/counterpart.routes');

// Uso das rotas API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/calls', energyCallRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/counterparts', counterpartRoutes);

// Verificar se estamos em produção
if (process.env.NODE_ENV === 'production') {
  console.log('Servindo arquivos estáticos de:', path.join(__dirname, '../client/build'));
  // Servir arquivos estáticos da pasta build do cliente
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Para qualquer rota não-API, retornar o app React
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
} else {
  // Rotas básicas em desenvolvimento
  app.get('/', (req, res) => {
    res.json({ message: 'API do EnergyCalls - Sistema de Gerenciamento de Chamadas de Energia da CELESC' });
  });

  // Manipulação de rotas não encontradas em desenvolvimento
  app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
  });
}

// Manipulação de erros
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err.stack);
  res.status(500).json({ 
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Porta do servidor
const PORT = config.app.port || 5000;

// Sincronizar com o banco de dados e iniciar o servidor
console.log('Tentando conectar ao banco de dados...');
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch(err => {
  console.error('Erro ao sincronizar com o banco de dados:', err);
  
  // Ainda iniciar o servidor mesmo com erro no banco
  console.log('Iniciando servidor sem banco de dados...');
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} (sem banco de dados)`);
  });
});

module.exports = app; 