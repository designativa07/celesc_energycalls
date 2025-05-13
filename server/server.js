const express = require('express');
const cors = require('cors');
const path = require('path');

// Interceptar erros globais para evitar travamentos
process.on('uncaughtException', (error) => {
  console.error('ERRO NÃO CAPTURADO:', error);
  // Não deixar o processo terminar
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('PROMESSA NÃO TRATADA:', reason);
  // Não deixar o processo terminar
});

// Inicialização do Express
const app = express();

// Logs para depuração na inicialização
console.log('========= INICIANDO SERVIDOR =========');
console.log('Ambiente:', process.env.NODE_ENV);
console.log('Porta:', process.env.PORT);
console.log('Diretório do servidor:', __dirname);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de health check simples
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// Rota API básica que sempre funciona
app.get('/api', (req, res) => {
  res.status(200).json({ 
    message: 'API do EnergyCalls - Sistema de Gerenciamento de Chamadas de Energia da CELESC',
    status: 'online',
    version: '1.0.0',
    time: new Date().toISOString()
  });
});

// Tentar carregar a configuração e o banco de dados, mas continuar mesmo que falhe
let config;
try {
  config = require('./config/config');
  console.log('Configuração carregada com sucesso');
} catch (error) {
  console.error('Erro ao carregar configuração:', error);
  config = {
    app: { port: process.env.PORT || 5000 }
  };
}

// Tentar carregar o banco de dados e as rotas, mas continuar mesmo que falhe
try {
  console.log('Tentando carregar configuração do banco de dados...');
  const sequelize = require('./config/database');
  
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
}

// Verificar se estamos em produção
if (process.env.NODE_ENV === 'production') {
  try {
    console.log('Servindo arquivos estáticos de:', path.join(__dirname, '../client/build'));
    
    // Verificar se o diretório existe antes de servi-lo
    const fs = require('fs');
    const clientBuildPath = path.join(__dirname, '../client/build');
    
    if (fs.existsSync(clientBuildPath)) {
      // Servir arquivos estáticos da pasta build do cliente
      app.use(express.static(clientBuildPath));
      
      // Para qualquer rota não-API, retornar o app React
      app.get('*', (req, res) => {
        res.sendFile(path.join(clientBuildPath, 'index.html'));
      });
      
      console.log('Arquivos estáticos configurados com sucesso');
    } else {
      console.error('Diretório de build do cliente não encontrado:', clientBuildPath);
      
      // Fallback para uma resposta básica
      app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
          res.status(503).send('Sistema em manutenção. Frontend não disponível.');
        }
      });
    }
  } catch (error) {
    console.error('Erro ao servir arquivos estáticos:', error);
    
    // Fallback para uma resposta básica
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.status(503).send('Sistema em manutenção. Tente novamente mais tarde.');
      }
    });
  }
} else {
  // Rotas básicas em desenvolvimento
  app.get('/', (req, res) => {
    res.json({ message: 'API do EnergyCalls - Sistema de Gerenciamento de Chamadas de Energia da CELESC' });
  });
}

// Manipulação de rotas não encontradas
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ message: 'Rota não encontrada' });
  } else {
    next();
  }
});

// Manipulação de erros
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  res.status(500).json({ 
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Porta do servidor
const PORT = process.env.PORT || config.app.port || 5000;

// Iniciar o servidor independentemente do banco de dados
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app; 