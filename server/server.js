const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
let sequelize;

// Logs para depuração na inicialização
console.log('========= INICIANDO SERVIDOR =========');
console.log('Ambiente:', process.env.NODE_ENV);
console.log('Porta:', process.env.PORT);
console.log('Diretório do servidor:', __dirname);

// Inicialização do Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de health check simples
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// Tentar carregar o banco de dados, mas continuar mesmo que falhe
try {
  console.log('Tentando carregar configuração do banco de dados...');
  sequelize = require('./config/database');
  
  // Importação dos modelos
  require('./models');
  
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
  
  console.log('Rotas API configuradas com sucesso');
} catch (error) {
  console.error('Erro ao configurar banco de dados ou rotas:', error);
  
  // Rota API básica para indicar que o servidor está funcionando, mesmo sem banco
  app.use('/api', (req, res) => {
    res.status(503).json({ 
      message: 'API do EnergyCalls - Banco de dados indisponível',
      status: 'maintenance'
    });
  });
}

// Verificar se estamos em produção
if (process.env.NODE_ENV === 'production') {
  console.log('Servindo arquivos estáticos de:', path.join(__dirname, '../client/build'));
  
  try {
    // Servir arquivos estáticos da pasta build do cliente
    app.use(express.static(path.join(__dirname, '../client/build')));
    
    // Para qualquer rota não-API, retornar o app React
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
  } catch (error) {
    console.error('Erro ao servir arquivos estáticos:', error);
    // Fallback para uma resposta básica
    app.get('*', (req, res) => {
      res.status(503).send('Sistema em manutenção. Tente novamente mais tarde.');
    });
  }
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

// Iniciar o servidor independentemente do banco de dados
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app; 