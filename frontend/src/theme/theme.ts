import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a9e5e',
      dark: '#137a49',
      light: '#4db87f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff6b35',
      dark: '#e55a25',
      light: '#ff8c5a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#5a5a7a',
    },
    error: { main: '#e53935' },
    success: { main: '#1a9e5e' },
    warning: { main: '#f59e0b' },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    '0 2px 8px rgba(0,0,0,0.08)',
    '0 4px 16px rgba(0,0,0,0.08)',
    '0 8px 24px rgba(0,0,0,0.10)',
    '0 12px 32px rgba(0,0,0,0.12)',
    '0 16px 40px rgba(0,0,0,0.12)',
    '0 20px 48px rgba(0,0,0,0.14)',
    '0 24px 56px rgba(0,0,0,0.14)',
    '0 28px 64px rgba(0,0,0,0.16)',
    '0 32px 72px rgba(0,0,0,0.16)',
    '0 36px 80px rgba(0,0,0,0.18)',
    '0 40px 88px rgba(0,0,0,0.18)',
    '0 44px 96px rgba(0,0,0,0.20)',
    '0 48px 104px rgba(0,0,0,0.20)',
    '0 52px 112px rgba(0,0,0,0.22)',
    '0 56px 120px rgba(0,0,0,0.22)',
    '0 60px 128px rgba(0,0,0,0.24)',
    '0 64px 136px rgba(0,0,0,0.24)',
    '0 68px 144px rgba(0,0,0,0.26)',
    '0 72px 152px rgba(0,0,0,0.26)',
    '0 76px 160px rgba(0,0,0,0.28)',
    '0 80px 168px rgba(0,0,0,0.28)',
    '0 84px 176px rgba(0,0,0,0.30)',
    '0 88px 184px rgba(0,0,0,0.30)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '14px',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1a9e5e, #137a49)',
          '&:hover': { background: 'linear-gradient(135deg, #137a49, #0d6035)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.04)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1a9e5e',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: '0 1px 8px rgba(0,0,0,0.08)' },
      },
    },
  },
})

export default theme
