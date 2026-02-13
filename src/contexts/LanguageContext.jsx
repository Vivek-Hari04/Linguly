import { createContext, useContext, useState, useEffect } from 'react';
import { getSelectedLanguage, setSelectedLanguage as persistLanguage } from '../services/storage';
import courseData from '../data/course.json';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguageState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
   
    const loadLanguage = () => {
  const saved = getSelectedLanguage();

  if (saved && courseData.languages[saved]) {
    setSelectedLanguageState(saved);
  } else {
    setSelectedLanguageState(null);
  }

  setIsLoading(false);
};

    loadLanguage();
  }, []);

  const setSelectedLanguage = (languageCode) => {
  // Going back to landing page
  if (languageCode === null) {
    persistLanguage(null);
    setSelectedLanguageState(null);
    return;
  }

  // Normal language selection
  if (!courseData.languages[languageCode]) {
    console.error(`Language ${languageCode} not found in course data`);
    return;
  }

  persistLanguage(languageCode);
  setSelectedLanguageState(languageCode);
};


  const getLanguageInfo = (code = selectedLanguage) => {
    if (!code || !courseData.languages[code]) return null;
    return {
      code,
      ...courseData.languages[code]
    };
  };

  const getAllLanguages = () => {
    return Object.entries(courseData.languages).map(([code, info]) => ({
      code,
      ...info
    }));
  };

  const value = {
    selectedLanguage,
    setSelectedLanguage,
    getLanguageInfo,
    getAllLanguages,
    isLoading
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};