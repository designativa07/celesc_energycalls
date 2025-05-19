import React, { createContext, useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';

// Layout components
import Layout from './components/Layout/Layout';
import CounterpartPortalLayout from './components/Layout/CounterpartPortalLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CallsList from './pages/Calls/CallsList';
import CallCreate from './pages/Calls/CallCreate';
import CallDetail from './pages/Calls/CallDetail';
import CounterpartsList from './pages/Counterparts/CounterpartsList';
import CounterpartDetail from './pages/Counterparts/CounterpartDetail';
import CounterpartCreate from './pages/Counterparts/CounterpartCreate';
import UsersList from './pages/Users/UsersList';
import UserEdit from './pages/Users/UserEdit';
import NotFound from './pages/NotFound';

// Counterpart Portal Pages
import CounterpartLogin from './pages/CounterpartPortal/CounterpartLogin';
import CounterpartDashboard from './pages/CounterpartPortal/Dashboard';
import CounterpartCallsList from './pages/CounterpartPortal/CallsList';
import CounterpartCallDetail from './pages/CounterpartPortal/CallDetail';
import CounterpartMyProposals from './pages/CounterpartPortal/MyProposals';

// Auth providers
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CounterpartAuthProvider, useCounterpartAuth } from './contexts/CounterpartAuthContext';

// Create ColorMode context
export const ColorModeContext = createContext({ 
  toggleColorMode: () => {},
  mode: 'light'
});

// Protected route component for internal users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Protected route component for counterpart portal
const ProtectedCounterpartRoute = ({ children }) => {
  const { isAuthenticated, loading } = useCounterpartAuth();
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/counterpart-login" />;
  }
  
  return children;
};

function App() {
  // Use prefers-color-scheme media query to detect system preference
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  // Try to get saved mode from localStorage or use system preference
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('colorMode');
    return savedMode || (prefersDarkMode ? 'dark' : 'light');
  });

  // Update localStorage when mode changes
  useEffect(() => {
    localStorage.setItem('colorMode', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Palette for light mode
                primary: {
                  main: '#0077cc', // A professional, vibrant blue
                  light: '#4da3ff',
                  dark: '#005fa3',
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: '#ff8f00', // Amber/Orange for accents
                  light: '#ffc046',
                  dark: '#c56000',
                  contrastText: '#000000',
                },
                background: {
                  default: '#f4f6f8', // Slightly off-white for a softer background
                  paper: '#ffffff',
                },
                text: {
                  primary: '#172b4d', // Darker text for better contrast
                  secondary: '#5e6c84',
                  disabled: '#97a0af',
                },
                divider: 'rgba(0,0,0,0.08)',
              }
            : {
                // Palette for dark mode
                primary: {
                  main: '#69b3ff', // Lighter blue for dark mode
                  light: '#a8d8ff',
                  dark: '#2a8bf0',
                  contrastText: '#000000',
                },
                secondary: {
                  main: '#ffab40', // Lighter amber for dark mode
                  light: '#ffdd71',
                  dark: '#c77c02',
                  contrastText: '#000000',
                },
                background: {
                  default: '#0a1929', // Darker, desaturated blue
                  paper: '#12263f',   // Slightly lighter for elevated surfaces
                },
                text: {
                  primary: '#e0e0e0',
                  secondary: '#b0bec5',
                  disabled: '#78909c',
                },
                divider: 'rgba(255,255,255,0.08)',
              }),
        },
        typography: {
          fontFamily: [
            'Poppins',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif'
          ].join(','),
          fontSize: 14.5, // Slightly increased base font size
          h1: {
            fontSize: '2.3rem', // Adjusted sizes
            fontWeight: 700,
          },
          h2: {
            fontSize: '1.9rem',
            fontWeight: 600,
          },
          h3: {
            fontSize: '1.6rem',
            fontWeight: 600,
          },
          h4: {
            fontSize: '1.4rem',
            fontWeight: 600,
          },
          h5: {
            fontSize: '1.2rem',
            fontWeight: 600,
          },
          h6: { // Often used for AppBar titles or Card headers
            fontSize: '1.05rem',
            fontWeight: 600, 
          },
          body1: {
            fontSize: '1rem', // Standard body text
          },
          body2: {
            fontSize: '0.9rem', // Secondary text
          },
          button: {
            textTransform: 'none',
            fontWeight: 600, // Bolder buttons
            fontSize: '0.9rem',
          },
          caption: {
            fontSize: '0.8rem',
          },
          overline: {
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
          }
        },
        shape: {
          borderRadius: 10, // Slightly more rounded corners
        },
        spacing: 8,
        components: {
          MuiCssBaseline: {
            styleOverrides: (themeParam) => ({ // themeParam to avoid conflict
              body: {
                transition: 'background-color 0.3s ease-in-out',
              },
              '*::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
              },
              '*::-webkit-scrollbar-thumb': {
                backgroundColor: themeParam.palette.mode === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
                borderRadius: '4px',
              },
              '*::-webkit-scrollbar-thumb:hover': {
                backgroundColor: themeParam.palette.mode === 'light' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
              },
              '*::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
              },
            }),
          },
          MuiButton: {
            styleOverrides: {
              root: ({ ownerState, theme: themeParam }) => ({ // Destructure theme for clarity
                textTransform: 'none',
                fontWeight: 600,
                padding: '8px 18px', // Adjusted padding
                borderRadius: themeParam.shape.borderRadius, // Consistent border radius
                boxShadow: 'none', // Remove default button shadow, add on hover/active if desired
                transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: ownerState.variant === 'contained' 
                    ? (themeParam.palette.mode === 'light' ? '0px 2px 8px rgba(0,0,0,0.1)' : '0px 2px 8px rgba(0,0,0,0.3)')
                    : 'none',
                }
              }),
              sizeSmall: {
                padding: '6px 12px',
                fontSize: '0.85rem',
              },
              sizeLarge: {
                padding: '10px 24px',
                fontSize: '0.95rem',
              },
              containedPrimary: ({ theme: themeParam }) => ({
                '&:hover': {
                  backgroundColor: themeParam.palette.primary.dark,
                }
              }),
              containedSecondary: ({ theme: themeParam }) => ({
                '&:hover': {
                  backgroundColor: themeParam.palette.secondary.dark,
                }
              }),
            },
          },
          MuiCard: {
            styleOverrides: {
              root: ({ theme: themeParam }) => ({
                boxShadow: themeParam.palette.mode === 'light'
                  ? '0px 5px 22px rgba(0, 0, 0, 0.06)' // Softer shadow
                  : '0px 5px 22px rgba(0, 0, 0, 0.3)',
                borderRadius: 16, // Larger radius for cards
                padding: themeParam.spacing(2.5), // More padding
                transition: 'box-shadow 0.3s cubic-bezier(.25,.8,.25,1)',
                '&:hover': {
                    boxShadow: themeParam.palette.mode === 'light'
                    ? '0px 10px 30px rgba(0, 0, 0, 0.08)'
                    : '0px 10px 30px rgba(0, 0, 0, 0.4)',
                }
              }),
            },
          },
          MuiCardContent: {
            styleOverrides: {
              root: ({ theme: themeParam }) => ({
                padding: themeParam.spacing(2),
                '&:last-child': {
                  paddingBottom: themeParam.spacing(2),
                },
              }),
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: ({ theme: themeParam }) => ({
                boxShadow: themeParam.palette.mode === 'light'
                  ? '0px 2px 10px rgba(0, 0, 0, 0.07)'
                  : '0px 2px 10px rgba(0, 0, 0, 0.25)',
                // The backdropFilter and backgroundColor are handled well in Layout.js
                // We can keep those local to the AppBarStyled component if they differ
              }),
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: ({ theme: themeParam }) => ({
                borderRight: themeParam.palette.mode === 'light' ? `1px solid ${themeParam.palette.divider}` : 'none',
                backgroundColor: themeParam.palette.background.paper, // Ensure drawer uses paper color
              }),
            },
          },
          MuiTextField: {
            defaultProps: {
              variant: 'outlined', // Default to outlined
            },
            styleOverrides: {
              root: ({ theme: themeParam }) => ({
                marginBottom: themeParam.spacing(2.5),
                '& .MuiInputBase-input': {
                  fontSize: '0.95rem',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.95rem',
                  '&.Mui-focused': {
                    // color: themeParam.palette.primary.main, // Already handled by default
                  },
                },
                 '& .MuiOutlinedInput-root': {
                    borderRadius: themeParam.shape.borderRadius, // Consistent border radius
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: themeParam.palette.primary.light,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: themeParam.palette.primary.main,
                        borderWidth: '1px', // MUI default is 2px, can make it 1px for a sleeker look
                    },
                },
              }),
            },
          },
          MuiFormControl: {
            styleOverrides: {
              root: ({ theme: themeParam }) => ({
                marginBottom: themeParam.spacing(2.5),
                width: '100%',
              }),
            },
          },
          MuiInputLabel: { // This might be redundant if MuiTextField covers it
            styleOverrides: {
              root: ({ theme: themeParam }) => ({
                // marginBottom: themeParam.spacing(1),
                fontSize: '0.95rem',
              }),
            },
          },
          MuiSelect: {
            defaultProps: {
              variant: 'outlined',
            },
            styleOverrides: {
              root: ({ theme: themeParam }) => ({
                // marginBottom: themeParam.spacing(2.5), // Handled by FormControl
                fontSize: '0.95rem',
                 '& .MuiOutlinedInput-root': { // Target specifically for Select
                    borderRadius: themeParam.shape.borderRadius,
                },
              }),
            },
          },
          MuiFormGroup: {
            styleOverrides: {
              root: ({ theme: themeParam }) => ({
                marginBottom: themeParam.spacing(2),
              }),
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: ({ theme: themeParam }) => ({
                padding: themeParam.spacing(1.5, 2), // Adjusted padding
                fontSize: '0.9rem',
                borderBottom: `1px solid ${themeParam.palette.divider}`,
              }),
              head: ({ theme: themeParam }) => ({
                fontWeight: 600,
                backgroundColor: themeParam.palette.mode === 'light' ? themeParam.palette.grey[100] : themeParam.palette.grey[800],
                color: themeParam.palette.text.primary,
              }),
              body: ({ theme: themeParam }) => ({
                color: themeParam.palette.text.secondary,
              }),
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: ({ theme: themeParam }) => ({
                margin: themeParam.spacing(0.5, 1), // Add some horizontal margin
                borderRadius: themeParam.shape.borderRadius,
                padding: themeParam.spacing(1, 2), // Increase padding
                transition: 'background-color 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: themeParam.palette.action.hover,
                },
                '&.Mui-selected': {
                  backgroundColor: themeParam.palette.action.selected,
                  // color: themeParam.palette.primary.main, // Already handled
                  '& .MuiListItemIcon-root': {
                    // color: themeParam.palette.primary.main, // Already handled
                  },
                  '&:hover': {
                    backgroundColor: themeParam.palette.action.selected, // Keep selected color on hover
                  }
                },
              }),
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: ({ theme: themeParam }) => ({
                backgroundColor: themeParam.palette.mode === 'light' ? themeParam.palette.grey[700] : themeParam.palette.grey[300],
                color: themeParam.palette.mode === 'light' ? '#fff' : '#000',
                fontSize: '0.8rem',
                borderRadius: themeParam.shape.borderRadius / 2,
                padding: themeParam.spacing(0.5, 1),
              }),
              arrow: ({ theme: themeParam }) => ({
                color: themeParam.palette.mode === 'light' ? themeParam.palette.grey[700] : themeParam.palette.grey[300],
              }),
            },
          },
           MuiMenu: {
            styleOverrides: {
              paper: ({ theme: themeParam }) => ({
                boxShadow: themeParam.palette.mode === 'light'
                  ? '0px 4px 20px rgba(0,0,0,0.1)'
                  : '0px 4px 20px rgba(0,0,0,0.4)',
                borderRadius: themeParam.shape.borderRadius,
              }),
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: ({ theme: themeParam }) => ({
                paddingTop: themeParam.spacing(1),
                paddingBottom: themeParam.spacing(1),
                fontSize: '0.9rem',
                '&:hover': {
                    backgroundColor: themeParam.palette.action.hover,
                }
              }),
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CounterpartAuthProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* Admin/Internal Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="calls">
                    <Route index element={<CallsList />} />
                    <Route path="create" element={<CallCreate />} />
                    <Route path=":id" element={<CallDetail />} />
                  </Route>
                  <Route path="counterparts">
                    <Route index element={<CounterpartsList />} />
                    <Route path="create" element={<CounterpartCreate />} />
                    <Route path=":id" element={<CounterpartDetail />} />
                  </Route>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path="edit/:id" element={<UserEdit />} />
                  </Route>
                </Route>
                
                {/* Counterpart Portal Routes */}
                <Route path="/counterpart-login" element={<CounterpartLogin />} />
                
                <Route 
                  path="/counterpart-portal" 
                  element={
                    <ProtectedCounterpartRoute>
                      <CounterpartPortalLayout />
                    </ProtectedCounterpartRoute>
                  }
                >
                  <Route index element={<CounterpartDashboard />} />
                  <Route path="calls">
                    <Route index element={<CounterpartCallsList />} />
                    <Route path=":id" element={<CounterpartCallDetail />} />
                  </Route>
                  <Route path="my-proposals" element={<CounterpartMyProposals />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </AuthProvider>
        </CounterpartAuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
