import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const themes = {
  default: {
    name: 'Neo Violet',
    violet: '#8b5cf6',
    orange: '#f97316'
  },
  cyberpunk: {
    name: 'Cyberpunk',
    violet: '#ec4899', // pink
    orange: '#06b6d4' // cyan
  },
  ocean: {
    name: 'Oceanic',
    violet: '#3b82f6', // blue
    orange: '#10b981' // emerald
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');

  useEffect(() => {
    // Select random theme ONCE exactly on boot
    const themeKeys = Object.keys(themes);
    const randomKey = themeKeys[Math.floor(Math.random() * themeKeys.length)];
    setCurrentTheme(randomKey);
  }, []);

  useEffect(() => {
    // Dynamically inject native CSS properties into the :root namespace.
    const root = document.documentElement;
    const colors = themes[currentTheme];
    
    root.style.setProperty('--color-brand-violet', colors.violet);
    root.style.setProperty('--color-brand-orange', colors.orange);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, themeData: themes[currentTheme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
