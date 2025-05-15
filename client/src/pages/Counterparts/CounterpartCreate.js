import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Container
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import api from '../../api/api';

const CounterpartCreate = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    companyName: '',
    cnpj: '',
    contactName: '',
    email: '',
    phone: '',
    active: true,
    notes: ''
  });
  
  // Manipulador de mudanças nos campos
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'active' ? checked : value
    }));
  };
  
  // Função para validar formulário
  const validateForm = () => {
    const errors = {};
    
    if (!formData.companyName.trim()) {
      errors.companyName = 'O nome da empresa é obrigatório';
    }
    
    if (!formData.cnpj.trim()) {
      errors.cnpj = 'O CNPJ é obrigatório';
    } else if (!/^\d{14}$/.test(formData.cnpj)) {
      errors.cnpj = 'CNPJ deve conter 14 dígitos numéricos';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    return errors;
  };
  
  // Função para submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulário
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setError('Por favor, corrija os erros no formulário');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await api.post('/counterparts', formData);
      setSuccess(true);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/counterparts');
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Erro ao criar contraparte. Por favor, tente novamente.'
      );
      console.error('Erro ao criar contraparte:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Nova Contraparte
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Contraparte criada com sucesso! Redirecionando...
        </Alert>
      )}
      
      <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, boxShadow: (theme) => theme.palette.mode === 'light' ? '0 4px 20px 0 rgba(0,0,0,0.05)' : '0 4px 20px 0 rgba(0,0,0,0.2)' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                label="Nome da Empresa"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                disabled={loading || success}
                variant="outlined"
                margin="normal"
                sx={{ mb: 3 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                label="CNPJ"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 14 }}
                helperText="Digite apenas os números, sem pontuação"
                disabled={loading || success}
                variant="outlined"
                margin="normal"
                sx={{ mb: 3 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                label="Nome do Contato"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                disabled={loading || success}
                variant="outlined"
                margin="normal"
                sx={{ mb: 3 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading || success}
                variant="outlined"
                margin="normal"
                sx={{ mb: 3 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading || success}
                variant="outlined"
                margin="normal"
                sx={{ mb: 3 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={6}>
              <Box sx={{ pt: 2, mt: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                      disabled={loading || success}
                      color="primary"
                    />
                  }
                  label="Ativa"
                  sx={{ ml: 1 }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={4}
                disabled={loading || success}
                variant="outlined"
                margin="normal"
                sx={{ mb: 4 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'flex-end',
                mt: 2,
                pt: 2,
                borderTop: 1,
                borderColor: 'divider'
              }}>
                <Button 
                  type="button" 
                  variant="outlined"
                  size="large"
                  startIcon={<CancelIcon />}
                  onClick={() => navigate('/counterparts')}
                  disabled={loading || success}
                  sx={{ px: 3 }}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading || success}
                  sx={{ px: 3 }}
                >
                  Salvar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CounterpartCreate; 