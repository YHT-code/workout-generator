import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Animated, Platform, useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark';

export const palettes = {
  dark: {
    background: '#06141B',
    surface: '#11212D',
    elevated: '#253745',
    muted: '#4A5C6A',
    secondary: '#9BA8AB',
    text: '#CCD0CF',
    accent: '#CCD0CF',
    onAccent: '#06141B',
    danger: '#FF8A80',
  },
  light: {
    background: '#CCD0CF',
    surface: '#E9ECEB',
    elevated: '#F7F8F8',
    muted: '#9BA8AB',
    secondary: '#4A5C6A',
    text: '#06141B',
    accent: '#253745',
    onAccent: '#CCD0CF',
    danger: '#8C2F39',
  },
} as const;

type ThemeContextValue = {
  mode: ThemeMode;
  colors: (typeof palettes)[ThemeMode];
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_KEY = 'repforge-native-theme';

export function AppThemeProvider({ children }: PropsWithChildren) {
  const systemMode = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemMode === 'dark' ? 'dark' : 'light');
  const [fade] = useState(() => new Animated.Value(1));

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark') setMode(stored);
    });
  }, []);

  const toggleMode = useCallback(() => {
    const next = mode === 'dark' ? 'light' : 'dark';
    Haptics.selectionAsync();
    Animated.timing(fade, { toValue: 0.35, duration: 140, useNativeDriver: Platform.OS !== 'web' }).start(() => {
      setMode(next);
      AsyncStorage.setItem(THEME_KEY, next);
      Animated.timing(fade, { toValue: 1, duration: 260, useNativeDriver: Platform.OS !== 'web' }).start();
    });
  }, [fade, mode]);

  const value = useMemo(() => ({ mode, colors: palettes[mode], toggleMode }), [mode, toggleMode]);

  return (
    <ThemeContext.Provider value={value}>
      <Animated.View style={{ flex: 1, opacity: fade, backgroundColor: value.colors.background }}>
        {children}
      </Animated.View>
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme must be used inside AppThemeProvider');
  return context;
}
