export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    missions: "Missions",
    goals: "Goals",
    analytics: "Analytics",
    achievements: "Achievements",
    profile: "Profile",
    
    // Common
    create: "Create",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    details: "Details",
    
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
    xpReward: "XP Reward",
    status: "Status",
    
    // Goals
    newGoal: "New Goal",
    goalCreated: "Goal Created!",
    goalUpdated: "Goal Updated!",
    goalDeleted: "Goal Deleted!",
    type: "Type",
    progress: "Progress",
    target: "Target",
    bossBattle: "BOSS BATTLE",
    longTerm: "LONG TERM",
    mediumTerm: "MEDIUM TERM",
  },
  pt: {
    // Navigation
    dashboard: "Painel",
    missions: "Missões",
    goals: "Metas",
    analytics: "Análises",
    achievements: "Conquistas",
    profile: "Perfil",
    
    // Common
    create: "Criar",
    edit: "Editar",
    delete: "Eliminar",
    cancel: "Cancelar",
    save: "Guardar",
    close: "Fechar",
    details: "Detalhes",
    
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
    xpReward: "Recompensa XP",
    status: "Estado",
    
    // Goals
    newGoal: "Nova Meta",
    goalCreated: "Meta Criada!",
    goalUpdated: "Meta Atualizada!",
    goalDeleted: "Meta Eliminada!",
    type: "Tipo",
    progress: "Progresso",
    target: "Objetivo",
    bossBattle: "BATALHA CHEFE",
    longTerm: "LONGO PRAZO",
    mediumTerm: "MÉDIO PRAZO",
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
