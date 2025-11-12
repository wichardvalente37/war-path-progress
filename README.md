# LIFE PROGRESS - War Mode Tracker

A gamified life progress tracking application built with React, TypeScript, Tailwind CSS, Node.js and PostgreSQL.

## 🚀 Features

- **Missions System**: Create and track daily missions with XP rewards
- **Goals Tracking**: Set and monitor long-term goals with categories
- **Achievements**: Unlock achievements based on your progress
- **Analytics**: View detailed statistics and performance metrics
- **Gamification**: Level up system with XP and difficulty levels
- **Recurring Missions**: Set up missions that repeat on specific days

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **React Router v6** - Routing
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web Framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password Hashing

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Setup Backend

#### Install Backend Dependencies

```bash
cd backend
npm install
```

#### Configure PostgreSQL Database

Criar o banco de dados:

```bash
# Conectar ao PostgreSQL (pode precisar de sudo)
psql -U postgres

# Criar banco de dados
CREATE DATABASE life_progress;

# Sair
\q
```

#### Configure Backend Environment Variables

```bash
cd backend
cp .env.example .env
```

Editar `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=life_progress
DB_USER=seu_usuario_postgres
DB_PASSWORD=sua_senha_postgres
JWT_SECRET=uma_chave_secreta_forte_e_aleatoria_aqui
PORT=3000
NODE_ENV=development
```

#### Run Database Migrations

```bash
npm run migrate
```

#### Start Backend Server

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Ou produção
npm start
```

Backend estará rodando em `http://localhost:3000`

### 3. Setup Frontend

#### Install Frontend Dependencies

```bash
cd ..  # Voltar para raiz do projeto
npm install
```

#### Configure Frontend Environment Variables

Criar `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Editar `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

#### Start Frontend Development Server

```bash
npm run dev
```

Frontend estará disponível em `http://localhost:8080`

## 🎮 Usage

### First Time Setup

1. Certifique-se que o **backend está rodando** (`http://localhost:3000`)
2. Abra o **frontend** no navegador (`http://localhost:8080`)
3. Clique em "Create Account" na página de login
4. Digite seu email e senha
5. Você será automaticamente logado
6. Comece criando sua primeira missão!

### Creating Missions

- Click on "Missions" in the navigation
- Click "Add Mission"
- Fill in the details:
  - **Title**: Name of your mission
  - **Description**: Optional details
  - **Difficulty**: Easy (10 XP), Normal (30 XP), Hard (50 XP), Extreme (100 XP)
  - **Due Date**: When the mission should be completed
  - **Recurring**: Enable to create repeated missions on specific days

### Setting Goals

- Navigate to "Goals"
- Add custom categories for your goals
- Create goals with progress tracking
- Link missions to goals for better organization

### Tracking Progress

- View your stats on the Dashboard
- Check detailed analytics in the Analytics page
- Unlock achievements as you progress
- Monitor your level and XP in the Profile page

## 🔐 Security Notes

- Senhas são criptografadas com bcrypt
- Autenticação via JWT (JSON Web Tokens)
- Tokens têm validade de 7 dias
- Cada usuário só acessa seus próprios dados
- **NUNCA** commit o arquivo `.env` para controle de versão

## 📦 Project Structure

```
├── backend/              # Backend API (Node.js/Express)
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Route controllers
│   │   ├── database/     # Database schema & migrations
│   │   ├── middlewares/  # Express middlewares
│   │   ├── routes/       # API routes
│   │   └── server.js     # Express server
│   ├── .env              # Backend environment variables
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── src/                  # Frontend (React)
│   ├── components/       # UI components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── Layout.tsx
│   │   └── LanguageSwitcher.tsx
│   ├── hooks/           # Custom React hooks
│   │   └── useAuth.tsx
│   ├── lib/             # Utilities
│   │   ├── api.ts       # API client
│   │   ├── i18n.ts      # Internationalization
│   │   └── utils.ts
│   ├── pages/           # Application pages
│   │   ├── Index.tsx
│   │   ├── Auth.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Missions.tsx
│   │   ├── Goals.tsx
│   │   ├── Analytics.tsx
│   │   ├── Achievements.tsx
│   │   ├── Profile.tsx
│   │   └── Settings.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env                 # Frontend environment variables
├── .env.example
└── README.md
```

## 🎨 Customization

### Themes

The app uses a custom theme system with Tailwind CSS. You can customize colors in:

- `src/index.css` - CSS variables for light/dark themes
- `tailwind.config.ts` - Tailwind theme configuration

### Adding Languages

The app supports multiple languages. To add a new language:

1. Open `src/lib/i18n.ts`
2. Add your translations to the `translations` object
3. Add the language option to the `LanguageSwitcher` component

## 🐛 Troubleshooting

### Backend não inicia

- Verifique se o PostgreSQL está rodando: `sudo service postgresql status` (Linux) ou `brew services list` (Mac)
- Confirme as credenciais no `backend/.env`
- Teste a conexão: `psql -U seu_usuario -d life_progress`

### Erro "relation does not exist"

- Execute as migrations: `cd backend && npm run migrate`

### Erro de autenticação no frontend

- Verifique se o backend está rodando em `http://localhost:3000`
- Confirme que `VITE_API_URL` no `.env` do frontend está correto
- Limpe o localStorage do navegador e tente novamente

### Porta já em uso

**Backend:**
- Mude a porta em `backend/.env`: `PORT=3001`

**Frontend:**
- Mude a porta em `vite.config.ts` ou use: `npm run dev -- --port 8081`

### Erro de CORS

- Verifique se o backend está configurado corretamente para aceitar requisições do frontend
- O CORS já está habilitado no `backend/src/server.js`

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📧 Support

For questions or issues, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ using Lovable.dev**
