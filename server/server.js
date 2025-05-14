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

// Logging de todas as requisições para debug
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
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
  const counterpartAuthRoutes = require('./routes/counterpart-auth.routes');
  const counterpartPortalRoutes = require('./routes/counterpart-portal.routes');
  const adminRoutes = require('./routes/admin.routes');
  
  // Uso das rotas API
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/calls', energyCallRoutes);
  app.use('/api/proposals', proposalRoutes);
  app.use('/api/counterparts', counterpartRoutes);
  app.use('/api/counterpart-auth', counterpartAuthRoutes);
  app.use('/api/counterpart-portal', counterpartPortalRoutes);
  app.use('/api/admin', adminRoutes);
  
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
    
    // Se o diretório de build não existir, criar um com um arquivo HTML básico
    if (!fs.existsSync(clientBuildPath)) {
      console.log('Diretório de build não encontrado. Criando um básico...');
      try {
        fs.mkdirSync(clientBuildPath, { recursive: true });
        const basicHtml = `
          <!DOCTYPE html>
          <html lang="pt-br">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>EnergyCalls CELESC</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                color: #333;
                background-color: #f5f5f5;
              }
              .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 2rem;
              }
              header {
                background-color: #004a93;
                color: white;
                padding: 1rem 0;
                text-align: center;
              }
              main {
                background: white;
                padding: 2rem;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                margin-top: 2rem;
              }
              h1 {
                color: #004a93;
              }
              .btn {
                display: inline-block;
                background: #004a93;
                color: white;
                padding: 0.5rem 1rem;
                text-decoration: none;
                border-radius: 4px;
                margin-top: 1rem;
              }
              footer {
                text-align: center;
                margin-top: 2rem;
                padding: 1rem 0;
                color: #666;
              }
            </style>
          </head>
          <body>
            <header>
              <div class="container">
                <h1>EnergyCalls CELESC</h1>
              </div>
            </header>
            <div class="container">
              <main>
                <h2>Bem-vindo ao Sistema de Chamadas de Energia da CELESC</h2>
                <p>Este é um sistema temporário para gerenciamento de chamadas de energia.</p>
                <p>O frontend completo estará disponível em breve.</p>
                <a href="/api" class="btn">Acessar API</a>
              </main>
              <footer>
                <p>&copy; CELESC ${new Date().getFullYear()}. Todos os direitos reservados.</p>
              </footer>
            </div>
          </body>
          </html>
        `;
        fs.writeFileSync(path.join(clientBuildPath, 'index.html'), basicHtml);
        console.log('Criado arquivo index.html básico no diretório de build');
      } catch (e) {
        console.error('Erro ao criar diretório de build e arquivo HTML:', e);
      }
    }
    
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
      console.error('Conteúdo do diretório client:', fs.existsSync(path.join(__dirname, '../client')) ? 
        fs.readdirSync(path.join(__dirname, '../client')).join(', ') : 'Diretório client não existe');
      
      // Fallback para uma resposta básica
      app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
          res.status(503).send(`
            <html>
              <head>
                <title>Sistema em manutenção</title>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; color: #333; }
                  .container { max-width: 800px; margin: 40px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                  h1 { color: #2c3e50; }
                  .info { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>Sistema em manutenção</h1>
                  <p>Frontend não disponível no momento. Por favor, tente novamente mais tarde.</p>
                  <div class="info">
                    <p>Informações técnicas:</p>
                    <p>Diretório esperado: ${clientBuildPath}</p>
                    <p>Diretório existe: ${fs.existsSync(clientBuildPath)}</p>
                    <p>NODE_ENV: ${process.env.NODE_ENV}</p>
                  </div>
                </div>
              </body>
            </html>
          `);
        }
      });
    }
  } catch (error) {
    console.error('Erro ao servir arquivos estáticos:', error);
    
    // Fallback para uma resposta básica
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.status(503).send('Sistema em manutenção. Tente novamente mais tarde. Erro: ' + error.message);
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