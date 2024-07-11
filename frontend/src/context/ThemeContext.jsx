import { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState("light"); // Default theme is light

  const toggleTheme = () => {
    setThemeName(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.body.className = themeName;
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
