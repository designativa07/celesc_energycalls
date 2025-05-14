# EnergyCalls - Sistema de Gerenciamento de Chamadas de Energia

Um sistema web para gerenciamento de chamadas de energia da CELESC, facilitando a comunicação entre a empresa e seus fornecedores/contrapartes.

## Funcionalidades

- Cadastro e gerenciamento de chamadas de energia
- Cadastro e homologação de contrapartes
- Portal da contraparte para envio de propostas
- Avaliação e seleção de propostas
- Relatórios e estatísticas

## Tecnologias

### Backend
- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL

### Frontend
- React.js
- Material-UI
- Axios

## Estrutura do Projeto

```
energycalls/
├── client/            # Aplicação React (frontend)
├── server/            # Aplicação Node.js (backend)
│   ├── config/        # Configurações
│   ├── controllers/   # Controladores da API
│   ├── middleware/    # Middleware personalizado
│   ├── models/        # Modelos do Sequelize
│   ├── routes/        # Rotas da API
│   └── scripts/       # Scripts utilitários
└── docs/              # Documentação
```

## Instalação

### Pré-requisitos
- Node.js (v18+)
- PostgreSQL

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm start
```

## Uso

1. Acesse o sistema como administrador em http://localhost:3000
2. Cadastre e homologue contrapartes
3. Crie chamadas de energia
4. As contrapartes podem acessar o portal via http://localhost:3000/counterpart-login

## Portal da Contraparte

Para que uma contraparte possa acessar o sistema:
1. Ela deve estar cadastrada e homologada no sistema
2. Um administrador deve gerar um código de acesso para a contraparte
3. A contraparte poderá fazer login usando seu CNPJ e o código de acesso gerado

## Licença

[MIT](LICENSE) 