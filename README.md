# LIFE PROGRESS - War Mode Tracker

A gamified life progress tracking application built with React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

- **Missions System**: Create and track daily missions with XP rewards
- **Goals Tracking**: Set and monitor long-term goals with categories
- **Achievements**: Unlock achievements based on your progress
- **Analytics**: View detailed statistics and performance metrics
- **Gamification**: Level up system with XP and difficulty levels
- **Recurring Missions**: Set up missions that repeat on specific days

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router v6
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (v18 or higher) installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn package manager
- A Supabase account (free tier is sufficient) - [Create account](https://supabase.com)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be created

#### Run Database Setup Script

1. In your Supabase project, go to the **SQL Editor**
2. Open the file `supabase/setup.sql` from this repository
3. Copy the entire contents of the file
4. Paste it into the Supabase SQL Editor
5. Click "Run" to execute the script

This will create all necessary tables, functions, triggers, and Row Level Security policies.

#### Configure Authentication

1. In your Supabase Dashboard, go to **Authentication** → **Settings**
2. Under "Email Auth", enable **"Confirm email"** to OFF for testing (you can enable it later for production)
3. Save your changes

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit the `.env` file and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

**Where to find these values:**

1. Go to your Supabase Dashboard
2. Select your project
3. Click on **Settings** (gear icon) → **API**
4. Copy the values:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon/public` key → `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Project ID (from the URL) → `VITE_SUPABASE_PROJECT_ID`

### 5. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:8080`

## 🎮 Usage

### First Time Setup

1. Open the application in your browser
2. Click "Create Account" on the login page
3. Enter your email and password
4. You'll be automatically logged in (since email confirmation is disabled)
5. Start creating your first mission!

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

- All user data is protected by Row Level Security (RLS) policies
- Users can only access their own data
- Authentication is handled securely by Supabase Auth
- Never commit your `.env` file to version control

## 📦 Project Structure

```
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Layout.tsx    # Main layout wrapper
│   │   └── LanguageSwitcher.tsx
│   ├── hooks/            # Custom React hooks
│   │   └── useAuth.tsx   # Authentication hook
│   ├── integrations/     # External service integrations
│   │   └── supabase/     # Supabase client and types
│   ├── lib/              # Utility functions
│   │   ├── i18n.ts       # Internationalization
│   │   └── utils.ts      # Helper functions
│   ├── pages/            # Application pages
│   │   ├── Index.tsx     # Landing page
│   │   ├── Auth.tsx      # Login/Signup
│   │   ├── Dashboard.tsx
│   │   ├── Missions.tsx
│   │   ├── Goals.tsx
│   │   ├── Analytics.tsx
│   │   ├── Achievements.tsx
│   │   ├── Profile.tsx
│   │   └── Settings.tsx
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles
├── supabase/
│   ├── setup.sql         # Database setup script
│   └── config.toml       # Supabase configuration
├── .env                  # Environment variables (create this)
├── .env.example          # Environment variables template
└── README.md             # This file
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

### "Invalid API key" error

- Double-check your `.env` file
- Ensure you're using the `anon/public` key, not the `service_role` key
- Restart the development server after changing `.env`

### Database connection errors

- Verify your Supabase project is active
- Check that the database setup script ran successfully
- Ensure RLS policies are enabled

### Authentication issues

- Make sure "Confirm email" is disabled in Supabase for testing
- Check that the `handle_new_user()` trigger is working (creates profile automatically)
- Clear browser cache and try again

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📧 Support

For questions or issues, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ using Lovable.dev**
