import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'modern' | 'pixel';

interface ThemeContextType {
  theme: Theme;
  toastTheme: Theme;
  isCracking: boolean;
  breachHits: number;
  breachStatusText: string;
  isUnlockedToastVisible: boolean;
  hasBreached: boolean;
  toggleTheme: (x?: number, y?: number) => void;
  systemRestore: () => void;
  triggerBreach: (x?: number, y?: number) => void;
  closeToast: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'localhostusak_theme';
const MANUAL_OVERRIDE_KEY = 'localhostusak_theme_manual';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      try {
        // Temizle — eski localStorage override'larını sil
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(MANUAL_OVERRIDE_KEY);
      } catch {}

      // Kullanıcı bu oturumda manuel değiştirdiyse onu kullan
      const manual = sessionStorage.getItem(MANUAL_OVERRIDE_KEY);
      const saved = sessionStorage.getItem(STORAGE_KEY) as Theme | null;
      if (manual === 'true' && (saved === 'modern' || saved === 'pixel')) {
        return saved;
      }
    }
    // Her zaman dark mode (modern) ile başla
    return 'modern';
  });

  // data-theme attribute'u güncelle
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    sessionStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback((_x?: number, _y?: number) => {
    const next: Theme = theme === 'modern' ? 'pixel' : 'modern';
    sessionStorage.setItem(MANUAL_OVERRIDE_KEY, 'true');
    sessionStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
  }, [theme]);

  // systemRestore: dark mode'a dön
  const systemRestore = useCallback(() => {
    sessionStorage.setItem(MANUAL_OVERRIDE_KEY, 'true');
    setThemeState('modern');
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toastTheme: theme,
        isCracking: false,
        breachHits: 0,
        breachStatusText: '',
        isUnlockedToastVisible: false,
        hasBreached: true,
        toggleTheme,
        systemRestore,
        triggerBreach: toggleTheme,
        closeToast: () => {},
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
