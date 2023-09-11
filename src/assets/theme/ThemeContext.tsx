import React, { createContext, useContext, useState } from 'react';

import { ITheme } from './types/base';
import { lightTheme } from './modes';

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeContextProps {
  theme:  ITheme;
  setTheme:  React.Dispatch<React.SetStateAction<ITheme>>;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: lightTheme,  
  setTheme: () => {}
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ITheme>(lightTheme as ITheme); 
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const { theme, } = useContext(ThemeContext);
  return theme;
};
