import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { setLanguage, getLanguage, Language } from "@/lib/i18n";
import { useState } from "react";

export const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState<Language>(getLanguage());

  const toggleLanguage = () => {
    const newLang: Language = currentLang === "en" ? "pt" : "en";
    setLanguage(newLang);
    setCurrentLang(newLang);
    window.location.reload();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="relative"
    >
      <Globe className="w-5 h-5" />
      <span className="absolute bottom-0 right-0 text-[10px] font-bold uppercase">
        {currentLang}
      </span>
    </Button>
  );
};
