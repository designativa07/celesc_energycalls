import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  PersonAddOutlined as PersonAddIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Resetar mensagens
    setError('');
    setSuccess('');
    
    // Validações básicas
    if (!formData.name || !formData.email || !formData.password || !formData.department) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    try {
      // Remover confirmPassword antes de enviar para a API
      const { confirmPassword, ...registerData } = formData;
      
      await register(registerData);
      
      setSuccess('Usuário registrado com sucesso!');
      
      // Redirecionar para a página de login após 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="sm">
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Cadastro
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            
            <Grid container spacing={2}>
              <Grid flex={12}>
                <TextField
                  label="Nome completo"
                  fullWidth
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!error}
                  helperText={error}
                />
              </Grid>
              
              <Grid flex={12}>
                <TextField
                  label="E-mail"
                  fullWidth
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!error}
                  helperText={error}
                />
              </Grid>
              
              <Grid flex={1}>
                <TextField
                  label="Senha"
                  fullWidth
                  required
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!error}
                  helperText={error}
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
                    )
                  }}
                />
              </Grid>
              
              <Grid flex={1}>
                <TextField
                  label="Confirmar senha"
                  fullWidth
                  required
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!error}
                  helperText={error}
                />
              </Grid>
              
              <Grid flex={12}>
                <TextField
                  label="Departamento/Área"
                  fullWidth
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid flex={12}>
                <FormControl fullWidth>
                  <InputLabel id="role-label">Cargo</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={formData.role}
                    label="Cargo"
                    onChange={handleChange}
                  >
                    <MenuItem value="user">Usuário</MenuItem>
                    <MenuItem value="manager">Gerente</MenuItem>
                    <MenuItem value="admin">Administrador</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Cadastrar
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  Já tem uma conta? Faça login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
      <Box sx={{ mt: 5, mb: 4, textAlign: 'center' }}>
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

export default Register;