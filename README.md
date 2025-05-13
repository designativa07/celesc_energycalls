# EnergyCalls - CELESC

Sistema de gestão de chamadas de compra e venda de energia para a CELESC (Centrais Elétricas de Santa Catarina).

## Descrição

EnergyCalls é uma aplicação web completa que digitaliza e otimiza o processo de chamadas de compra e venda de energia, que anteriormente era feito de forma manual. O sistema permite gerenciar todo o ciclo de vida das chamadas de energia, desde a criação até o registro na CCEE (Câmara de Comercialização de Energia Elétrica).

## Funcionalidades

- Autenticação e autorização de usuários com diferentes níveis de permissão
- Gestão de contrapartes (homologação, ativação/desativação)
- Criação, publicação, fechamento e cancelamento de chamadas de energia
- Recebimento e avaliação de propostas
- Registro de chamadas na CCEE
- Geração de relatórios

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- JWT para autenticação

### Frontend
- React
- Material-UI
- React Router
- Axios

## Requisitos

- Node.js 16+
- PostgreSQL 12+
- NPM ou Yarn

## Instalação

### Backend

```bash
# Acessar o diretório do servidor
cd server

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Criar um arquivo .env com as seguintes informações:
# PORT=5000
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=energycalls
# DB_USER=postgres
# DB_PASSWORD=sua_senha
# JWT_SECRET=sua_chave_secreta
# JWT_EXPIRES_IN=24h

# Iniciar o servidor em modo de desenvolvimento
npm run dev
```

### Frontend

```bash
# Acessar o diretório do cliente
cd client

# Instalar dependências
npm install

# Iniciar o cliente em modo de desenvolvimento
npm start
```

## Estrutura do Projeto

- `/server` - API backend
  - `/controllers` - Controladores da aplicação
  - `/models` - Modelos de dados
  - `/routes` - Rotas da API
  - `/middleware` - Middlewares
  - `/config` - Configurações

- `/client` - Interface de usuário
  - `/src/pages` - Páginas da aplicação
  - `/src/components` - Componentes reutilizáveis
  - `/src/contexts` - Contextos para gerenciamento de estado
  - `/src/api` - Configuração e chamadas de API

## Licença

Este projeto foi desenvolvido para a CELESC (Centrais Elétricas de Santa Catarina). 