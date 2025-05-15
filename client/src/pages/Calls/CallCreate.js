import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  MenuItem, 
  FormControl, 
  FormControlLabel,
  InputLabel, 
  Select,
  Switch,
  Alert,
  CircularProgress
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import api from '../../api/api';

const CallCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'buy',
    energyType: 'conventional',
    amount: '',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    deadline: new Date(new Date().setDate(new Date().getDate() + 7)),
    description: '',
    requirements: '',
    isExtraordinary: false,
    status: 'draft'
  });
  
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isExtraordinary' ? checked : value
    }));
  };
  
  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/calls', formData);
      navigate(`/calls/${response.data.energyCall.id}`);
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Erro ao criar chamada de energia. Por favor, tente novamente.'
      );
      console.error('Erro ao criar chamada:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/calls', {
        ...formData,
        status: 'open'
      });
      navigate(`/calls/${response.data.energyCall.id}`);
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Erro ao publicar chamada de energia. Por favor, tente novamente.'
      );
      console.error('Erro ao publicar chamada:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Nova Chamada de Energia
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid style={{ gridColumn: 'span 12' }}>
              <TextField
                fullWidth
                label="Título da Chamada"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid style={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Operação</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  label="Tipo de Operação"
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="buy">Compra</MenuItem>
                  <MenuItem value="sell">Venda</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid style={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Energia</InputLabel>
                <Select
                  name="energyType"
                  value={formData.energyType}
                  label="Tipo de Energia"
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="conventional">Convencional</MenuItem>
                  <MenuItem value="incentivized">Incentivada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid style={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
              <TextField
                fullWidth
                label="Quantidade (MWh)"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid style={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DateTimePicker
                  label="Data de Início"
                  value={formData.startDate}
                  onChange={(date) => handleDateChange(date, 'startDate')}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid style={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DateTimePicker
                  label="Data de Término"
                  value={formData.endDate}
                  onChange={(date) => handleDateChange(date, 'endDate')}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid style={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DateTimePicker
                  label="Prazo para Propostas"
                  value={formData.deadline}
                  onChange={(date) => handleDateChange(date, 'deadline')}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid style={{ gridColumn: 'span 12' }}>
              <TextField
                fullWidth
                label="Descrição da Chamada"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid style={{ gridColumn: 'span 12' }}>
              <TextField
                fullWidth
                label="Requisitos e Observações"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid style={{ gridColumn: 'span 12' }}>
              <FormControlLabel
                control={
                  <Switch
                    name="isExtraordinary"
                    checked={formData.isExtraordinary}
                    onChange={handleChange}
                  />
                }
                label="Chamada Extraordinária"
              />
            </Grid>
            
            <Grid style={{ gridColumn: 'span 12' }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  type="button" 
                  onClick={() => navigate('/calls')}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="outlined"
                  disabled={loading}
                >
                  Salvar como Rascunho
                </Button>
                <Button 
                  type="button" 
                  variant="contained" 
                  color="primary"
                  onClick={handlePublish}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Publicar Chamada'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CallCreate; 