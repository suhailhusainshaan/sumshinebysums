'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '@/service/auth.service';
import { useAuthStore } from '@/store/authStore';

type ThemeMode = 'light' | 'dark';
type LightThemeName = 'pearl' | 'champagne';

type StorefrontThemeContextValue = {
  mode: ThemeMode;
  activeLightTheme: LightThemeName;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleMode: () => Promise<void>;
};

const DEFAULT_MODE: ThemeMode = 'light';
const DEFAULT_LIGHT_THEME: LightThemeName = 'pearl';
const GUEST_MODE_KEY = 'storefrontThemeMode';
const ALLOWED_LIGHT_THEMES = new Set<LightThemeName>(['pearl', 'champagne']);

const StorefrontThemeContext = createContext<StorefrontThemeContextValue | undefined>(undefined);

function normalizeMode(theme: unknown): ThemeMode | null {
  return theme === 'dark' || theme === 'light' ? theme : null;
}

function normalizeLightTheme(theme: unknown): LightThemeName {
  return typeof theme === 'string' && ALLOWED_LIGHT_THEMES.has(theme as LightThemeName)
    ? (theme as LightThemeName)
    : DEFAULT_LIGHT_THEME;
}

function getCachedUserTheme(): ThemeMode | null {
  if (typeof window === 'undefined') return null;

  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;
    return normalizeMode(JSON.parse(storedUser)?.theme);
  } catch {
    return null;
  }
}

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return DEFAULT_MODE;
  return (
    getCachedUserTheme() ?? normalizeMode(localStorage.getItem(GUEST_MODE_KEY)) ?? DEFAULT_MODE
  );
}

export function StorefrontThemeProvider({
  children,
  initialLightTheme = DEFAULT_LIGHT_THEME,
}: {
  children: React.ReactNode;
  initialLightTheme?: string;
}) {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const [guestMode, setGuestMode] = useState<ThemeMode>(getInitialMode);
  const [activeLightTheme] = useState<LightThemeName>(() => normalizeLightTheme(initialLightTheme));
  const mode = normalizeMode(user?.theme) ?? guestMode;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    document.documentElement.dataset.lightTheme = activeLightTheme;
  }, [mode, activeLightTheme]);

  const setMode = useCallback(
    async (nextMode: ThemeMode) => {
      setGuestMode(nextMode);

      if (user) {
        login({ ...user, theme: nextMode });
        try {
          const response = await authService.updateTheme(nextMode);
          if (response?.data) {
            login({ ...user, ...response.data, theme: nextMode });
          }
        } catch (error) {
          console.error('[StorefrontThemeProvider] Failed to save theme preference', error);
        }
        return;
      }

      localStorage.setItem(GUEST_MODE_KEY, nextMode);
    },
    [login, user]
  );

  const toggleMode = useCallback(async () => {
    await setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  const value = useMemo(
    () => ({ mode, activeLightTheme, setMode, toggleMode }),
    [activeLightTheme, mode, setMode, toggleMode]
  );

  return (
    <StorefrontThemeContext.Provider value={value}>{children}</StorefrontThemeContext.Provider>
  );
}

export function useStorefrontTheme() {
  const context = useContext(StorefrontThemeContext);
  if (!context) {
    throw new Error('useStorefrontTheme must be used within a StorefrontThemeProvider');
  }
  return context;
}
