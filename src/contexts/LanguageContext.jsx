import { createContext, useContext, useState, useEffect } from 'react';
import { getSelectedLanguage, setSelectedLanguage as setSelectedLanguageStorage, getProgress } from '../services/storage';
import { getLessonsForLanguage, getTranslationsForLanguage, getLanguageDisplayName, getLanguageFlag, clearLanguageCache } from '../services/lessonService';

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
  const [lessons, setLessons] = useState(null);
  const [translations, setTranslations] = useState({});
  const [progress, setProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  // Load initial language and content
  useEffect(() => {
    loadLanguageAndContent();
  }, []);

  const loadLanguageAndContent = async () => {
    try {
      setIsLoading(true);
      
      // Get selected language from storage
      const languageCode = getSelectedLanguage();
      setSelectedLanguageState(languageCode);
      
      // If no language is selected, just set loading to false
      if (!languageCode) {
        setIsLoading(false);
        return;
      }
      
      // Load progress for this language
      const languageProgress = getProgress(languageCode);
      setProgress(languageProgress);
      
      // Load lessons and translations in parallel
      setIsGeneratingContent(true);
      const [lessonsData, translationsData] = await Promise.all([
        getLessonsForLanguage(languageCode),
        getTranslationsForLanguage(languageCode)
      ]);
      
      setLessons(lessonsData);
      setTranslations(translationsData);
      
    } catch (error) {
      console.error('Error loading language and content:', error);
    } finally {
      setIsLoading(false);
      setIsGeneratingContent(false);
    }
  };

  const changeLanguage = async (languageCode, forceRefresh = false) => {
    try {
      setIsLoading(true);
      setIsGeneratingContent(true);
      
      // Clear cache if force refresh is requested
      if (forceRefresh) {
        clearLanguageCache(languageCode);
      }
      
      // Update selected language in storage
      setSelectedLanguageStorage(languageCode);
      setSelectedLanguageState(languageCode);
      
      // Load progress for new language
      const languageProgress = getProgress(languageCode);
      setProgress(languageProgress);
      
      // Load lessons and translations for new language
      const [lessonsData, translationsData] = await Promise.all([
        getLessonsForLanguage(languageCode, forceRefresh),
        getTranslationsForLanguage(languageCode)
      ]);
      
      setLessons(lessonsData);
      setTranslations(translationsData);
      
    } catch (error) {
      console.error('Error changing language:', error);
      // Still update the language even if content generation fails
      setSelectedLanguageStorage(languageCode);
      setSelectedLanguageState(languageCode);
    } finally {
      setIsLoading(false);
      setIsGeneratingContent(false);
    }
  };

  const translate = (key, fallback = key) => {
    // For UI elements, always fall back to English to keep interface accessible
    const uiElements = [
      'Language Learner',
      'Master Spanish one word at a time',
      'Change Language',
      'Back to Levels',
      'Your Progress',
      'Keep up the great work!',
      'Learning:',
      'Start Level',
      'Practice Again',
      'Locked',
      'Previous',
      'Next',
      'Start Quiz',
      'Finish Level',
      'Next Question',
      'Quick Quiz',
      'Question',
      'of',
      'Correct!',
      'The correct answer is:',
      'Tap to reveal',
      'Pronounce word',
      'Get AI hint',
      'Completed',
      'Basics & Greetings',
      'Essential words to get started',
      'Daily Life',
      'Common phrases for daily life',
      'Conversations',
      'Build your conversational skills',
      'Finish Level 2 to unlock'
    ];
    
    // If it's a UI element, always return English
    if (uiElements.includes(key)) {
      return fallback;
    }
    
    // For other content, use translations
    return translations[key] || fallback;
  };

  const updateProgress = (newProgress) => {
    setProgress(prev => ({ ...prev, ...newProgress }));
  };

  const getCurrentLevel = (levelNumber) => {
    if (!lessons) return null;
    const levelKey = `level${levelNumber}`;
    return lessons[levelKey] || null;
  };

  const getLanguageInfo = () => {
    if (!selectedLanguage) return null;
    
    return {
      code: selectedLanguage,
      name: getLanguageDisplayName(selectedLanguage),
      flag: getLanguageFlag(selectedLanguage)
    };
  };

  const value = {
    selectedLanguage,
    lessons,
    translations,
    progress,
    isLoading,
    isGeneratingContent,
    translate,
    changeLanguage,
    updateProgress,
    getCurrentLevel,
    getLanguageInfo,
    reloadContent: loadLanguageAndContent
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};