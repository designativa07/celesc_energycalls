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
          primary: {
            main: mode === 'light' ? '#1976d2' : '#90caf9',
          },
          secondary: {
            main: mode === 'light' ? '#f50057' : '#f48fb1',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
        typography: {
          fontFamily: [
            'Poppins',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif'
          ].join(','),
          fontSize: 14,
          h1: {
            fontSize: '2.2rem',
            fontWeight: 600,
          },
          h2: {
            fontSize: '1.8rem',
            fontWeight: 600,
          },
          h3: {
            fontSize: '1.5rem',
            fontWeight: 600,
          },
          h4: {
            fontSize: '1.3rem',
            fontWeight: 600,
          },
          h5: {
            fontSize: '1.1rem',
            fontWeight: 600,
          },
          h6: {
            fontSize: '1rem',
            fontWeight: 600,
          },
          body1: {
            fontSize: '0.95rem',
          },
          body2: {
            fontSize: '0.875rem',
          },
          button: {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.9rem',
          },
        },
        shape: {
          borderRadius: 8,
        },
        spacing: 8, // Base spacing unit
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
                padding: '6px 16px',
              },
              sizeSmall: {
                padding: '4px 12px',
                fontSize: '0.8rem',
              },
              sizeLarge: {
                padding: '8px 22px',
                fontSize: '1rem',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'light' 
                  ? '0px 4px 20px rgba(0, 0, 0, 0.05)' 
                  : '0px 4px 20px rgba(0, 0, 0, 0.2)',
                borderRadius: 12,
                padding: '16px',
              },
            },
          },
          MuiCardContent: {
            styleOverrides: {
              root: {
                padding: '16px',
                '&:last-child': {
                  paddingBottom: '16px',
                },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                marginBottom: '16px',
                '& .MuiInputBase-input': {
                  fontSize: '0.95rem',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.95rem',
                }
              },
            },
          },
          MuiFormControl: {
            styleOverrides: {
              root: {
                marginBottom: '16px',
                width: '100%',
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                marginBottom: '6px',
                fontSize: '0.95rem',
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              root: {
                marginBottom: '16px',
                fontSize: '0.95rem',
              },
            },
          },
          MuiFormGroup: {
            styleOverrides: {
              root: {
                marginBottom: '16px',
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                padding: '12px 16px',
                fontSize: '0.9rem',
              },
              head: {
                fontWeight: 600,
                fontSize: '0.9rem',
              },
            },
          },
          MuiDialogContent: {
            styleOverrides: {
              root: {
                padding: '16px 24px',
              },
            },
          },
          MuiListItem: {
            styleOverrides: {
              root: {
                paddingTop: '6px',
                paddingBottom: '6px',
              },
            },
          },
          MuiListItemText: {
            styleOverrides: {
              primary: {
                fontSize: '0.95rem',
              },
              secondary: {
                fontSize: '0.85rem',
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                margin: '12px 0',
              },
            },
          },
          MuiContainer: {
            styleOverrides: {
              root: {
                paddingLeft: '16px',
                paddingRight: '16px',
                '@media (min-width:600px)': {
                  paddingLeft: '24px',
                  paddingRight: '24px',
                },
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                fontSize: '0.95rem',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                padding: '16px',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                padding: '0',
              },
            },
          },
          MuiToolbar: {
            styleOverrides: {
              root: {
                minHeight: '56px',
                '@media (min-width:600px)': {
                  minHeight: '56px',
                },
              },
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
