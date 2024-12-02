import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2563eb',
    secondary: '#4f46e5',
    accent: '#3b82f6',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
  },
  roundness: 8,
  animation: {
    scale: 1.0,
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
    labelLarge: {
      fontFamily: 'System',
      fontWeight: '500',
      fontSize: 16,
      lineHeight: 24,
    },
    labelMedium: {
      fontFamily: 'System',
      fontWeight: '500',
      fontSize: 14,
      lineHeight: 20,
    },
    labelSmall: {
      fontFamily: 'System',
      fontWeight: '500',
      fontSize: 12,
      lineHeight: 16,
    }
  },
}; 