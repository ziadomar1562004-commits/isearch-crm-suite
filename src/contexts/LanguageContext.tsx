import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.leads': 'Leads',
    'nav.projects': 'Projects',
    'nav.units': 'Units',
    'nav.areas': 'Areas',
    'nav.settings': 'Settings',
    'leads.title': 'Leads',
    'leads.add': 'Add Lead',
    'units.title': 'Units',
    'units.add': 'Add Unit',
    'units.filters': 'Filters',
    'units.area': 'Area',
    'units.paymentMethod': 'Payment Method',
    'units.minSize': 'Min Size (m²)',
    'units.maxSize': 'Max Size (m²)',
    'common.search': 'Search',
    'common.reset': 'Reset',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
  },
  ar: {
    'nav.dashboard': 'لوحة القيادة',
    'nav.leads': 'العملاء المحتملون',
    'nav.projects': 'المشاريع',
    'nav.units': 'الوحدات',
    'nav.areas': 'المناطق',
    'nav.settings': 'الإعدادات',
    'leads.title': 'العملاء المحتملون',
    'leads.add': 'إضافة عميل',
    'units.title': 'الوحدات',
    'units.add': 'إضافة وحدة',
    'units.filters': 'الفلاتر',
    'units.area': 'المنطقة',
    'units.paymentMethod': 'طريقة الدفع',
    'units.minSize': 'أقل مساحة (م²)',
    'units.maxSize': 'أكبر مساحة (م²)',
    'common.search': 'بحث',
    'common.reset': 'إعادة ضبط',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('crm_lang');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('crm_lang', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
