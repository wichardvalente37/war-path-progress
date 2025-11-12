# Life Progress Backend API

Backend Node.js/Express com PostgreSQL para o Life Progress Tracker.

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas

## 📋 Pré-requisitos

- Node.js v18+
- PostgreSQL v12+
- npm ou yarn

## 🔧 Instalação

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Configurar Banco de Dados PostgreSQL

Criar o banco de dados:

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE life_progress;

# Sair
\q
```

### 3. Configurar Variáveis de Ambiente

Copiar e editar o arquivo `.env`:

```bash
cp .env.example .env
```

Editar `.env` com suas credenciais:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=life_progress
DB_USER=seu_usuario_postgres
DB_PASSWORD=sua_senha_postgres
JWT_SECRET=uma_chave_secreta_forte_aqui
PORT=3000
```

### 4. Executar Migrations

```bash
npm run migrate
```

### 5. Iniciar o Servidor

```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📡 API Endpoints

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Obter usuário atual (requer token)

### Perfil

- `GET /api/profile` - Obter perfil do usuário
- `PUT /api/profile` - Atualizar perfil

### Missões

- `GET /api/missions` - Listar todas as missões
- `POST /api/missions` - Criar nova missão
- `PUT /api/missions/:id` - Atualizar missão
- `DELETE /api/missions/:id` - Deletar missão

### Metas

- `GET /api/goals` - Listar todas as metas
- `POST /api/goals` - Criar nova meta
- `PUT /api/goals/:id` - Atualizar meta
- `DELETE /api/goals/:id` - Deletar meta

### Categorias

- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria
- `DELETE /api/categories/:id` - Deletar categoria

### Conquistas

- `GET /api/achievements` - Listar conquistas
- `POST /api/achievements` - Criar conquista
- `DELETE /api/achievements/:id` - Deletar conquista

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens). Após login/registro, você receberá um token que deve ser enviado no header:

```
Authorization: Bearer seu_token_aqui
```

## 📦 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # Configuração do PostgreSQL
│   ├── controllers/          # Lógica de negócio
│   ├── database/
│   │   ├── schema.sql        # Schema do banco de dados
│   │   └── migrate.js        # Script de migração
│   ├── middlewares/
│   │   └── auth.js           # Middleware de autenticação
│   ├── routes/               # Rotas da API
│   └── server.js             # Servidor Express
├── .env                      # Variáveis de ambiente (criar)
├── .env.example              # Exemplo de variáveis
├── package.json
└── README.md
```

## 🐛 Troubleshooting

### Erro de conexão com PostgreSQL

- Verifique se o PostgreSQL está rodando: `sudo service postgresql status`
- Confirme usuário e senha no `.env`
- Teste a conexão: `psql -U seu_usuario -d life_progress`

### Erro "relation does not exist"

- Execute as migrations novamente: `npm run migrate`

### Porta já em uso

- Mude a porta no `.env`: `PORT=3001`

## 🧪 Testar a API

Usar curl, Postman ou Insomnia:

```bash
# Health check
curl http://localhost:3000/api/health

# Registrar
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"senha123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"senha123"}'
```

## 📝 Licença

MIT
