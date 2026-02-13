import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = typeof window !== 'undefined'
      ? window.localStorage.getItem('theme')
      : null;
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', saved === 'dark');
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', theme);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = {
    theme,
    toggleTheme,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
