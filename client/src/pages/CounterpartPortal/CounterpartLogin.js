import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Container,
  Alert,
  Link 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCounterpartAuth } from '../../contexts/CounterpartAuthContext';

const CounterpartLogin = () => {
  const [cnpj, setCnpj] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const { login, error, clearError } = useCounterpartAuth();
  const navigate = useNavigate();
  
  // Formatar CNPJ enquanto digita
  const handleCnpjChange = (e) => {
    let value = e.target.value;
    // Remover caracteres não numéricos
    value = value.replace(/\D/g, '');
    
    // Adicionar formatação
    if (value.length <= 14) {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    
    setCnpj(value);
  };
  
  const handleAccessCodeChange = (e) => {
    // Limitar a 6 dígitos
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setAccessCode(value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    
    try {
      // Limpar CNPJ para enviar apenas números
      const cnpjClean = cnpj.replace(/\D/g, '');
      
      await login(cnpjClean, accessCode);
      navigate('/counterpart-portal');
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAdminAreaClick = () => {
    navigate('/login');
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
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Portal da Contraparte
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Acesse para visualizar chamadas e enviar propostas
          </Typography>
          
          {(loginError || error) && (
            <Alert 
              severity="error" 
              sx={{ width: '100%', mb: 2 }}
              onClose={clearError}
            >
              {loginError || error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="cnpj"
              label="CNPJ"
              name="cnpj"
              autoComplete="cnpj"
              value={cnpj}
              onChange={handleCnpjChange}
              inputProps={{ maxLength: 18 }}
              autoFocus
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="accessCode"
              label="Código de Acesso"
              type="text"
              id="accessCode"
              value={accessCode}
              onChange={handleAccessCodeChange}
              inputProps={{ maxLength: 6 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Não tem um código de acesso?{' '}
                <Link href="#" onClick={(e) => { e.preventDefault(); }}>
                  Entre em contato
                </Link>
              </Typography>
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mt: 2, cursor: 'pointer' }}
                onClick={handleAdminAreaClick}
              >
                Área administrativa
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CounterpartLogin; 