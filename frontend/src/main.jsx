import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// MUI Theme Imports
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';

// Создаем контекст для управления темой
export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
  mode: 'light'
});

// Компонент-провайдер темы
function ThemeProviderWithToggle({ children }) {
  // Проверяем сохраненную тему из localStorage или системные настройки
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedMode = localStorage.getItem('theme-mode');
  const initialMode = storedMode || (prefersDarkMode ? 'dark' : 'light');

  const [mode, setMode] = React.useState(initialMode);

  React.useEffect(() => {
    // Сохраняем выбранную тему в localStorage
    localStorage.setItem('theme-mode', mode);
    // Добавляем класс к body для переключения стилей вне React
    document.body.setAttribute('data-theme', mode);
  }, [mode]);

  const colorMode = React.useMemo(() => ({
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    },
    mode
  }), [mode]);

  // Создаем тему в зависимости от режима
  const theme = React.useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === 'light' 
        ? {
            // Светлая тема
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
          }
        : {
            // Темная тема
            primary: {
              main: '#669DF6', // Material 3 blue for dark mode
              light: '#D3E3FD',
              dark: '#0C5EFF',
              contrastText: '#000',
            },
            secondary: {
              main: '#5BB974', // Material 3 green for dark mode
              light: '#C9F4D9',
              dark: '#149942',
              contrastText: '#000',
            },
            background: {
              default: '#121212',
              paper: '#1F1F1F',
            },
            surfaceVariant: {
              main: '#2C2C2C',
            },
            error: {
              main: '#F28B82',
            },
            warning: {
              main: '#FDD663',
            },
            info: {
              main: '#669DF6',
            },
            success: {
              main: '#5BB974',
            },
            text: {
              primary: '#E3E3E3',
              secondary: '#ABABAB',
              disabled: '#777777',
            },
            divider: '#393939',
            action: {
              hover: '#303030',
              selected: '#303030',
              disabled: '#505050',
              disabledBackground: '#2B2B2B',
            },
          }),
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
            background: mode === 'light' 
              ? 'linear-gradient(90deg, #4285F4 60%, #34A853 100%)'
              : 'linear-gradient(90deg, #669DF6 60%, #5BB974 100%)',
            color: mode === 'light' ? '#fff' : '#000',
            '&:hover': {
              background: mode === 'light'
                ? 'linear-gradient(90deg, #174EA6 60%, #0B8043 100%)'
                : 'linear-gradient(90deg, #0C5EFF 60%, #149942 100%)',
            },
          },
          outlined: {
            borderWidth: 2,
            borderColor: mode === 'light' ? '#E0E3E7' : '#393939',
            color: mode === 'light' ? '#4285F4' : '#669DF6',
            background: mode === 'light' ? '#fff' : 'transparent',
            '&:hover': {
              borderColor: mode === 'light' ? '#4285F4' : '#669DF6',
              background: mode === 'light' ? '#F2F7FB' : '#303030',
            },
          },
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: mode === 'light' ? '#fff' : '#1F1F1F',
            color: mode === 'light' ? '#1A1C1E' : '#E3E3E3',
            boxShadow: '0px 1.5px 4px 0px rgba(60,64,67,0.08)',
          }
        }
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderTopLeftRadius: 22,
            borderBottomLeftRadius: 22,
            boxShadow: mode === 'light' 
              ? '-4px 0 28px #d3eafc33'
              : '-4px 0 28px #00000033',
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
  }), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProviderWithToggle>
      <App />
    </ThemeProviderWithToggle>
  </StrictMode>,
)
