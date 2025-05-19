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
  CircularProgress
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
    <Box sx={{ width: '100%', px: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          Nova Contraparte
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3, fontSize: '0.9rem' }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3, fontSize: '0.9rem' }}>
          Contraparte criada com sucesso! Redirecionando...
        </Alert>
      )}
      
      <Paper 
        elevation={2}
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          borderRadius: 2,
          boxShadow: (theme) => theme.palette.mode === 'light' 
            ? '0 2px 10px 0 rgba(0,0,0,0.05)' 
            : '0 2px 10px 0 rgba(0,0,0,0.2)'
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Nome da Empresa"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                disabled={loading || success}
                variant="outlined"
                margin="dense"
                sx={{ mb: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="CNPJ"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 14 }}
                helperText="Digite apenas os números, sem pontuação"
                disabled={loading || success}
                variant="outlined"
                margin="dense"
                sx={{ mb: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Nome do Contato"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                disabled={loading || success}
                variant="outlined"
                margin="dense"
                sx={{ mb: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading || success}
                variant="outlined"
                margin="dense"
                sx={{ mb: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading || success}
                variant="outlined"
                margin="dense"
                sx={{ mb: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ pt: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                      disabled={loading || success}
                      color="primary"
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">Ativa</Typography>}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Observações"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={3}
                disabled={loading || success}
                variant="outlined"
                margin="dense"
                sx={{ mb: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'flex-end',
                mt: 1,
                pt: 2,
                borderTop: 1,
                borderColor: 'divider'
              }}>
                <Button 
                  type="button" 
                  variant="outlined"
                  size="medium"
                  startIcon={<CancelIcon />}
                  onClick={() => navigate('/counterparts')}
                  disabled={loading || success}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  size="medium"
                  startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
                  disabled={loading || success}
                >
                  Salvar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CounterpartCreate; 