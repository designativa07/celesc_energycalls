import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
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
  return (
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
  );
}

export default App;
