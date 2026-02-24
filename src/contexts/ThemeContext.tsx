/**
 * ThemeContext – single source of truth for dark/light mode.
 * Syncs to document.documentElement class "dark" and optionally persists to localStorage.
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'theme';

type ThemeContextValue = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readInitialDark(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light') return false;
    if (stored === 'dark') return true;
  } catch {
    // ignore
  }
  return document.documentElement.classList.contains('dark');
}

function syncDarkToDocument(isDark: boolean) {
  const root = document.documentElement;
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(readInitialDark);

  useEffect(() => {
    syncDarkToDocument(isDark);
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (value == null) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return value;
}
