import React from 'react';
import { useTranslation } from '../i18n/TranslationContext';
import { Globe } from 'lucide-react';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 text-white hover:text-[#FBEB04] group"
      title={language === 'en' ? 'Switch to Chinese' : '切换到英文'}
    >
      <Globe className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
      <span className="text-sm font-medium">
        {language === 'en' ? '中文' : 'EN'}
      </span>
    </button>
  );
};
