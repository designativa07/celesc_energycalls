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
  CircularProgress,
  Divider,
  Tooltip,
  IconButton
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import api from '../../api/api';
import { Save as SaveIcon, Publish as PublishIcon, Cancel as CancelIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const CallCreate = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
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
  
  const handleSubmit = async (e, publish = false) => {
    e.preventDefault();
    setActionLoading(publish ? 'publish' : 'save');
    setError(null);
    
    const payload = {
      ...formData,
      status: publish ? 'open' : 'draft'
    };

    try {
      const response = await api.post('/calls', payload);
      navigate(`/calls/${response.data.energyCall.id}?status=${publish ? 'published' : 'saved'}`);
    } catch (error) {
      setError(
        error.response?.data?.message || 
        `Erro ao ${publish ? 'publicar' : 'salvar'} chamada. Tente novamente.`
      );
      console.error(`Erro ao ${publish ? 'publicar' : 'salvar'} chamada:`, error);
    } finally {
      setActionLoading(null);
    }
  };
  
  return (
    <Box p={{ xs: 2, sm: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box display="flex" alignItems="center">
            <IconButton onClick={() => navigate('/calls')} sx={{ mr: 1.5 }} aria-label="Voltar">
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Nova Chamada de Energia
            </Typography>
        </Box>
      </Box>
      
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: theme.shape.borderRadius * 1.5 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={(e) => handleSubmit(e, false)}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 500 }}>
            Detalhes da Chamada
          </Typography>
          <Grid container spacing={3} sx={{mb: 3}}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título da Chamada"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={!!actionLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth required disabled={!!actionLoading}>
                <InputLabel>Tipo de Operação</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  label="Tipo de Operação"
                  onChange={handleChange}
                >
                  <MenuItem value="buy">Compra</MenuItem>
                  <MenuItem value="sell">Venda</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth required disabled={!!actionLoading}>
                <InputLabel>Tipo de Energia</InputLabel>
                <Select
                  name="energyType"
                  value={formData.energyType}
                  label="Tipo de Energia"
                  onChange={handleChange}
                >
                  <MenuItem value="conventional">Convencional</MenuItem>
                  <MenuItem value="incentivized">Incentivada</MenuItem>
                  <MenuItem value="renewable">Renovável</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Quantidade (MWh)"
                name="amount"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                value={formData.amount}
                onChange={handleChange}
                required
                disabled={!!actionLoading}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 500, mt:3 }}>
            Prazos e Períodos
          </Typography>
          <Grid container spacing={3} sx={{mb:3}}>
            <Grid item xs={12} sm={6} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DateTimePicker
                  label="Data de Início do Suprimento"
                  value={formData.startDate}
                  onChange={(date) => handleDateChange(date, 'startDate')}
                  slotProps={{ textField: { fullWidth: true, required: true, variant: 'outlined' } }}
                  ampm={false}
                  format="dd/MM/yyyy HH:mm"
                  disabled={!!actionLoading}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DateTimePicker
                  label="Data de Término do Suprimento"
                  value={formData.endDate}
                  onChange={(date) => handleDateChange(date, 'endDate')}
                  slotProps={{ textField: { fullWidth: true, required: true, variant: 'outlined' } }}
                  ampm={false}
                  format="dd/MM/yyyy HH:mm"
                  minDateTime={formData.startDate || undefined}
                  disabled={!!actionLoading}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DateTimePicker
                  label="Prazo Final para Propostas"
                  value={formData.deadline}
                  onChange={(date) => handleDateChange(date, 'deadline')}
                  slotProps={{ textField: { fullWidth: true, required: true, variant: 'outlined' } }}
                  ampm={false}
                  format="dd/MM/yyyy HH:mm"
                  minDate={new Date()}
                  disabled={!!actionLoading}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 500, mt:3 }}>
            Descrições e Configurações
          </Typography>
          <Grid container spacing={3} sx={{mb:3}}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição Detalhada da Chamada"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                disabled={!!actionLoading}
                helperText="Forneça todos os detalhes relevantes sobre a necessidade de compra ou venda."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requisitos Obrigatórios e Observações"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                multiline
                rows={3}
                disabled={!!actionLoading}
                helperText="Liste quaisquer condições especiais, documentos necessários ou outros critérios."
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="isExtraordinary"
                    checked={formData.isExtraordinary}
                    onChange={handleChange}
                    color="primary"
                    disabled={!!actionLoading}
                  />
                }
                label="Marcar como Chamada Extraordinária (urgente ou fora do padrão)"
              />
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Button 
              type="button" 
              variant="outlined"
              color="inherit" 
              onClick={() => navigate('/calls')}
              startIcon={<CancelIcon />}
              disabled={!!actionLoading}
              sx={{minWidth: 120}}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              variant="outlined" 
              color="secondary"
              startIcon={actionLoading === 'save' ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              disabled={!!actionLoading}
              sx={{minWidth: 200}}
            >
              Salvar como Rascunho
            </Button>
            <Button 
              type="button"
              variant="contained" 
              color="primary"
              onClick={(e) => handleSubmit(e, true)}
              startIcon={actionLoading === 'publish' ? <CircularProgress size={20} color="inherit" /> : <PublishIcon />}
              disabled={!!actionLoading}
              size="large"
              sx={{minWidth: 200}}
            >
              Publicar Chamada
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CallCreate; 