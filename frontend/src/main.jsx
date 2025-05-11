import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// MUI Theme Imports
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'material-symbols/rounded.css';

// Create a default theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#4285F4', // Material 3 blue
      light: '#B6DAFF',
      dark: '#174EA6',
      contrastText: '#fff',
    },
    secondary: {
      main: '#34A853', // Material 3 green
      light: '#B7F7D8',
      dark: '#0B8043',
      contrastText: '#fff',
    },
    background: {
      default: '#F8FAFB', // Material 3 background
      paper: '#FFFFFF',
    },
    surfaceVariant: {
      main: '#F2F7FB',
    },
    error: {
      main: '#EA4335',
    },
    warning: {
      main: '#FBBC05',
    },
    info: {
      main: '#4285F4',
    },
    success: {
      main: '#34A853',
    },
    text: {
      primary: '#1A1C1E',
      secondary: '#44474F',
      disabled: '#A1A1A1',
    },
    divider: '#E0E3E7',
    action: {
      hover: '#E8F0FE',
      selected: '#E3F2FD',
      disabled: '#F1F1F1',
      disabledBackground: '#F1F1F1',
    },
  },
  typography: {
    fontFamily: 'Roboto, system-ui, Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '2.8rem', letterSpacing: '-.02em' },
    h2: { fontWeight: 700, fontSize: '2.2rem', letterSpacing: '-.01em' },
    h3: { fontWeight: 700, fontSize: '1.8rem' },
    h4: { fontWeight: 700, fontSize: '1.5rem' },
    h5: { fontWeight: 700, fontSize: '1.25rem' },
    h6: { fontWeight: 700, fontSize: '1.1rem' },
    subtitle1: { fontWeight: 500, fontSize: '1rem' },
    subtitle2: { fontWeight: 500, fontSize: '0.95rem' },
    body1: { fontSize: '1rem', fontWeight: 400 },
    body2: { fontSize: '0.92rem', fontWeight: 400 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '.01em', borderRadius: 12 },
    caption: { fontSize: '0.8rem' },
    overline: { fontSize: '0.75rem', letterSpacing: '0.05em'}
  },
  shape: {
    borderRadius: 18, // Material 3 large radius
  },
  shadows: [
    'none',
    '0px 1.5px 4px 0px rgba(60,64,67,0.08)',
    '0px 2px 8px 0px rgba(60,64,67,0.12)',
    ...Array(22).fill('0px 2px 8px 0px rgba(60,64,67,0.10)')
  ],
  components: {
    MuiCard: {
      defaultProps: {
        elevation: 2,
      },
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0px 2px 8px 0px rgba(60,64,67,0.10)',
          background: '#fff',
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 600,
          fontSize: 17,
          padding: '10px 22px',
          boxShadow: 'none',
          letterSpacing: '.01em',
        },
        contained: {
          background: 'linear-gradient(90deg, #4285F4 60%, #34A853 100%)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(90deg, #174EA6 60%, #0B8043 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: '#E0E3E7',
          color: '#4285F4',
          background: '#fff',
          '&:hover': {
            borderColor: '#4285F4',
            background: '#F2F7FB',
          },
        },
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#fff',
          color: '#1A1C1E',
          boxShadow: '0px 1.5px 4px 0px rgba(60,64,67,0.08)',
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderTopLeftRadius: 22,
          borderBottomLeftRadius: 22,
          background: '#fff',
          boxShadow: '-4px 0 28px #d3eafc33',
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px 20px',
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 14,
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 8,
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          marginBottom: 4,
          transition: 'background 0.2s',
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        }
      }
    }
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme /> {/* enableColorScheme for better dark mode compatibility if added later */}
      <App />
    </ThemeProvider>
  </StrictMode>,
)
