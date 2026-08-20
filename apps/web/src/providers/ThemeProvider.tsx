'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { api } from '@/lib/api';

interface ThemeContextType {
  theme: string;
  colorMode: string;
  setTheme: (theme: string) => void;
  setColorMode: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colorMode: 'blue',
  setTheme: () => {},
  setColorMode: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState('light');
  const [colorMode, setColorModeState] = useState('blue');
  const [loaded, setLoaded] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    async function loadPrefs() {
      try {
        const prefs = await api.getPreferences();
        if (prefs) {
          setThemeState(prefs.theme || 'light');
          setColorModeState(prefs.colorMode || 'blue');
        }
      } catch {
        // Not logged in yet, use defaults
      } finally {
        setLoaded(true);
      }
    }
    loadPrefs();
  }, []);

  // Apply theme/color to HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-color', colorMode);
  }, [theme, colorMode]);

  const setTheme = useCallback((newTheme: string) => {
    setThemeState(newTheme);
    api.updatePreferences({ theme: newTheme }).catch(() => {});
  }, []);

  const setColorMode = useCallback((newColor: string) => {
    setColorModeState(newColor);
    api.updatePreferences({ colorMode: newColor }).catch(() => {});
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, colorMode, setTheme, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
