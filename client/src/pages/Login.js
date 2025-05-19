import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '@mui/material/styles';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validações básicas
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }
    
    try {
      const data = await login(email, password);
      console.log('Login bem-sucedido, dados do usuário:', data.user);
      console.log('Role do usuário após login:', data.user?.role);
      navigate('/');
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error.message);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'light' 
          ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[100]} 100%)` 
          : `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[900]} 100%)`,
        p: { xs: 2, sm: 3 }
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 4 },
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: theme.shape.borderRadius,
          }}
        >
          <img src="/logo-celesc-horizontal-peq.png" alt="Celesc Logo" style={{ height: '40px', marginBottom: theme.spacing(2) }} />
          <Typography component="h1" variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Acessar Plataforma
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Seu E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Sua Senha"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      color={showPassword ? "primary" : "default"}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Entrar
            </Button>
            
            <Box sx={{ my: 2, display: 'flex', alignItems: 'center', width: '100%' }}>
              <Divider sx={{ flexGrow: 1 }} />
              <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>OU</Typography>
              <Divider sx={{ flexGrow: 1 }} />
            </Box>
            
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              startIcon={<BusinessIcon />}
              component={RouterLink}
              to="/counterpart-login"
              size="large"
              sx={{ mb: 3 }}
            >
              Acessar como Contraparte
            </Button>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Link component={RouterLink} to="/forgot-password" variant="body2" color="primary.main">
                Esqueceu a senha?
              </Link>
              <Link component={RouterLink} to="/register" variant="body2" color="primary.main">
                {"Não tem uma conta? Cadastre-se"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
      <Box sx={{ mt: 'auto', py: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {'Copyright © '}
          <Link color="inherit" href="https://celesc.com.br/" target="_blank">
            EnergyCalls CELESC
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Box>
    </Box>
  );
};

export default Login; 