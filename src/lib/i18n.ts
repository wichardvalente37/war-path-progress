export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    missions: "Missions",
    goals: "Goals",
    analytics: "Analytics",
    achievements: "Achievements",
    profile: "Profile",
    settings: "Settings",
    
    // Common
    create: "Create",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    details: "Details",
    today: "Today",
    tomorrow: "Tomorrow",
    all: "All",
    filters: "Filters",
    noData: "No data available",
    
    // Auth
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    email: "Email",
    password: "Password",
    loginDescription: "Enter your credentials to access your account",
    signupDescription: "Create a new account to get started",
    noAccount: "Don't have an account? Sign up",
    haveAccount: "Already have an account? Login",
    loginSuccess: "Logged in successfully",
    signupSuccess: "Account created successfully",
    
    // Common status
    success: "Success",
    error: "Error",
    loading: "Loading...",
    current: "Current",
    
    // Missions
    newMission: "New Mission",
    missionCreated: "Mission Created!",
    missionUpdated: "Mission Updated!",
    missionDeleted: "Mission Deleted!",
    missionCompleted: "Mission Completed!",
    missionFailed: "Mission Failed",
    title: "Title",
    description: "Description",
    difficulty: "Difficulty",
    easy: "Easy",
    normal: "Normal",
    hard: "Hard",
    extreme: "Extreme",
    xpReward: "XP Reward",
    status: "Status",
    pending: "Pending",
    completed: "Completed",
    failed: "Failed",
    selectGoal: "Select Goal",
    noGoal: "No Goal",
    dueDate: "Due Date",
    recurring: "Recurring",
    numberOfCopies: "Number of Copies",
    recurringDays: "Recurring Days",
    selectDays: "Select Days",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    
    // Goals
    newGoal: "New Goal",
    goalCreated: "Goal Created!",
    goalUpdated: "Goal Updated!",
    goalDeleted: "Goal Deleted!",
    type: "Type",
    progress: "Progress",
    target: "Target",
    category: "Category",
    standard: "Standard",
    bossBattle: "Boss Battle",
    epic: "Epic",
    daily: "Daily",
    weekly: "Weekly",
    
    // Settings
    profileSettings: "Profile Settings",
    updateProfileInfo: "Update your profile information",
    username: "Username",
    enterUsername: "Enter your username",
    avatarUrl: "Avatar URL",
    saveChanges: "Save Changes",
    saving: "Saving...",
    profileUpdated: "Profile updated successfully",
    accountInfo: "Account Information",
    viewAccountDetails: "View your account details",
    accountId: "Account ID",
    databaseConfig: "Database Configuration",
    databaseConfigDesc: "Your Supabase connection is configured via environment variables",
    appInfo: "App Information",
    manageProfile: "Manage your profile and preferences",
  },
  pt: {
    // Navigation
    dashboard: "Painel",
    missions: "Missões",
    goals: "Metas",
    analytics: "Análises",
    achievements: "Conquistas",
    profile: "Perfil",
    settings: "Configurações",
    
    // Common
    create: "Criar",
    edit: "Editar",
    delete: "Eliminar",
    cancel: "Cancelar",
    save: "Guardar",
    close: "Fechar",
    details: "Detalhes",
    today: "Hoje",
    tomorrow: "Amanhã",
    all: "Todas",
    filters: "Filtros",
    noData: "Sem dados disponíveis",
    
    // Auth
    login: "Entrar",
    signup: "Registar",
    logout: "Sair",
    email: "E-mail",
    password: "Palavra-passe",
    loginDescription: "Insira as suas credenciais para aceder",
    signupDescription: "Crie uma nova conta para começar",
    noAccount: "Não tem conta? Registe-se",
    haveAccount: "Já tem conta? Entre",
    loginSuccess: "Login realizado com sucesso",
    signupSuccess: "Conta criada com sucesso",
    
    // Common status
    success: "Sucesso",
    error: "Erro",
    loading: "A carregar...",
    current: "Atual",
    
    // Missions
    newMission: "Nova Missão",
    missionCreated: "Missão Criada!",
    missionUpdated: "Missão Atualizada!",
    missionDeleted: "Missão Eliminada!",
    missionCompleted: "Missão Concluída!",
    missionFailed: "Missão Falhada",
    title: "Título",
    description: "Descrição",
    difficulty: "Dificuldade",
    easy: "Fácil",
    normal: "Normal",
    hard: "Difícil",
    extreme: "Extremo",
    xpReward: "Recompensa XP",
    status: "Estado",
    pending: "Pendente",
    completed: "Concluída",
    failed: "Falhada",
    selectGoal: "Selecionar Meta",
    noGoal: "Sem Meta",
    dueDate: "Data",
    recurring: "Recorrente",
    numberOfCopies: "Número de Cópias",
    recurringDays: "Dias Recorrentes",
    selectDays: "Selecionar Dias",
    monday: "Segunda",
    tuesday: "Terça",
    wednesday: "Quarta",
    thursday: "Quinta",
    friday: "Sexta",
    saturday: "Sábado",
    sunday: "Domingo",
    
    // Goals
    newGoal: "Nova Meta",
    goalCreated: "Meta Criada!",
    goalUpdated: "Meta Atualizada!",
    goalDeleted: "Meta Eliminada!",
    type: "Tipo",
    progress: "Progresso",
    target: "Objetivo",
    category: "Categoria",
    standard: "Padrão",
    bossBattle: "Boss Battle",
    epic: "Épica",
    daily: "Diária",
    weekly: "Semanal",
    
    // Settings
    profileSettings: "Configurações do Perfil",
    updateProfileInfo: "Atualize as informações do seu perfil",
    username: "Nome de Usuário",
    enterUsername: "Digite seu nome de usuário",
    avatarUrl: "URL do Avatar",
    saveChanges: "Guardar Alterações",
    saving: "A guardar...",
    profileUpdated: "Perfil atualizado com sucesso",
    accountInfo: "Informações da Conta",
    viewAccountDetails: "Veja os detalhes da sua conta",
    accountId: "ID da Conta",
    databaseConfig: "Configuração do Banco de Dados",
    databaseConfigDesc: "A conexão Supabase está configurada via variáveis de ambiente",
    appInfo: "Informações do App",
    manageProfile: "Gerencie seu perfil e preferências",
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

let currentLanguage: Language = "en";

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
  localStorage.setItem("language", lang);
};

export const getLanguage = (): Language => {
  const stored = localStorage.getItem("language") as Language;
  return stored || currentLanguage;
};

export const t = (key: TranslationKey): string => {
  const lang = getLanguage();
  return translations[lang][key] || translations.en[key] || key;
};
