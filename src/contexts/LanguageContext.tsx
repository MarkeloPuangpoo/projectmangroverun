'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'th' | 'en';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>('th');

    const toggleLanguage = () => {
        setLanguageState((prev) => (prev === 'th' ? 'en' : 'th'));
    };

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
