import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// MUI Theme Imports
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a default theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#229ED9', // from --color-primary
      light: alpha('#229ED9', 0.85), // Lighter primary for hover/selected states
      contrastText: '#fff',
    },
    secondary: {
      main: '#1ba05e', // from --color-accent
      light: alpha('#1ba05e', 0.2),
      dark: alpha('#1ba05e', 0.7),
      contrastText: '#fff',
    },
    background: {
      default: '#f6fbff', // from --color-bg
      paper: '#FFFFFF', // from --color-card
    },
    text: {
      primary: '#1d3557', // from original body color
      secondary: alpha('#1d3557', 0.7),
    },
    divider: '#e9f4fc', // from --color-border
    action: {
      hover: '#e7f6ff', // from --color-bg-soft
      // active: alpha('#229ED9', 0.1),
    },
    // Add custom colors if needed, e.g. for MacroBar
    // customColors: {
    //   carbs: '#3bafe8',
    //   protein: '#5fc77f',
    //   fat: '#ffb24a',
    // }
  },
  typography: {
    fontFamily: 'system-ui, Arial, sans-serif', // from --font-main
    h1: { fontWeight: 800, fontSize: '2.8rem' },
    h2: { fontWeight: 800, fontSize: '2.4rem' },
    h3: { fontWeight: 700, fontSize: '2.0rem' },
    h4: { fontWeight: 700, fontSize: '1.8rem' },
    h5: { fontWeight: 700, fontSize: '1.5rem' }, // Used for page/card titles
    h6: { fontWeight: 700, fontSize: '1.25rem' }, // Used for SideMenu profile name
    subtitle1: { fontWeight: 600, fontSize: '1.1rem' },
    subtitle2: { fontWeight: 600, fontSize: '0.95rem' }, // Used for MacroBar labels
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
    button: { textTransform: 'none', fontWeight: 700 }, // Default button style
    caption: { fontSize: '0.8rem' },
    overline: { fontSize: '0.75rem', letterSpacing: '0.05em'}
  },
  shape: {
    borderRadius: 18, // from --radius-main
  },
  components: {
    MuiCard: {
      defaultProps: {
        elevation: 3, // Default shadow for cards
      },
      styleOverrides: {
        root: {
          // borderRadius: 22, // from --radius-card, if different from global shape.borderRadius
        }
      }
    },
    MuiButton: {
      defaultProps: {
        // disableElevation: true, // If a flatter button style is preferred globally
      },
      styleOverrides: {
        root: {
           borderRadius: 12, // Consistent button border radius
          // transition: 'background .2s cubic-bezier(.55,.08,.39,.98), color .2s cubic-bezier(.55,.08,.39,.98)', // from --transition-main
        }
      }
    },
    MuiToggleButton: {
        styleOverrides: {
            root: {
                borderRadius: 8, // Slightly less than buttons for visual distinction in groups
                textTransform: 'none',
                fontWeight: 600,
            }
        }
    },
    MuiTextField: {
        defaultProps: {
            variant: 'outlined',
            size: 'small',
            fullWidth: true,
        }
    },
    MuiSelect: {
        defaultProps: {
            variant: 'outlined',
            size: 'small',
            fullWidth: true,
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
