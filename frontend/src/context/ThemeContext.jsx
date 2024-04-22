import { createContext, useContext, useState } from 'react';

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState("light"); // Default theme is light

  const toggleTheme = () => {
    // Toggle between light and dark themes
    setThemeName(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider
      value={{
        themeName,
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
