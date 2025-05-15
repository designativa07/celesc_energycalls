import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  Paper,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  LockOutlined as LockOutlinedIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
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
              label="Senha"
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
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Box>
                <Link href="#" variant="body2">
                  Esqueceu a senha?
                </Link>
              </Box>
              <Box>
                <Link component={RouterLink} to="/register" variant="body2">
                  {"Não tem uma conta? Cadastre-se"}
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {'Copyright © '}
          <Link color="inherit" href="#">
            EnergyCalls CELESC
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Box>
    </Container>
  );
};

export default Login; 