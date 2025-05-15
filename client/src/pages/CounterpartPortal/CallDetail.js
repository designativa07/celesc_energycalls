import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Divider,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Chip,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../../api/api';

const CallDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  
  // Formulário de proposta
  const [proposalForm, setProposalForm] = useState({
    price: '',
    amount: '',
    deliveryDate: null,
    validUntil: null,
    comments: ''
  });
  
  // Buscar dados da chamada
  useEffect(() => {
    const fetchCallDetails = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await api.get(`/counterpart-portal/calls/${id}`);
        setCall(response.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes da chamada:', error);
        setError(
          error.response?.data?.message || 
          'Erro ao carregar detalhes da chamada. Por favor, tente novamente.'
        );
      } finally {
        setLoading(false);
      }
    };
    
    fetchCallDetails();
  }, [id]);
  
  // Função para formatar data
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };
  
  // Calcular prazo restante
  const getRemainingDays = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  // Abrir diálogo para enviar proposta
  const handleOpenDialog = () => {
    setDialogOpen(true);
    
    // Preencher valor inicial da quantidade com o valor da chamada
    setProposalForm(prev => ({
      ...prev,
      amount: call.amount.toString()
    }));
  };
  
  // Fechar diálogo
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSubmitError('');
    setSubmitSuccess('');
  };
  
  // Atualizar formulário
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProposalForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Enviar proposta
  const handleSubmitProposal = async () => {
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');
    
    try {
      // Validar campos
      if (!proposalForm.price || !proposalForm.amount) {
        throw new Error('Preço e quantidade são campos obrigatórios');
      }
      
      // Enviar proposta
      await api.post('/counterpart-portal/proposals', {
        energyCallId: call.id,
        ...proposalForm
      });
      
      setSubmitSuccess('Proposta enviada com sucesso!');
      
      // Fechar o diálogo após um tempo
      setTimeout(() => {
        handleCloseDialog();
        navigate('/counterpart-portal/my-proposals');
      }, 2000);
    } catch (error) {
      console.error('Erro ao enviar proposta:', error);
      setSubmitError(
        error.response?.data?.message || 
        error.message || 
        'Erro ao enviar proposta. Por favor, tente novamente.'
      );
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }
  
  if (!call) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Chamada não encontrada.
      </Alert>
    );
  }
  
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          {call.title}
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleOpenDialog}
        >
          Enviar Proposta
        </Button>
      </Box>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid sx={{ gridColumn: 'span 4' }}>
            <Typography variant="subtitle1" gutterBottom>
              Tipo de Chamada
            </Typography>
            <Typography variant="body1">
              {call.type === 'buy' ? 'Compra' : 'Venda'} de Energia
            </Typography>
          </Grid>
          
          <Grid sx={{ gridColumn: 'span 4' }}>
            <Typography variant="subtitle1" gutterBottom>
              Tipo de Energia
            </Typography>
            <Typography variant="body1">
              <Chip 
                label={call.energyType === 'conventional' ? 'Convencional' : 'Incentivada'} 
                color={call.energyType === 'conventional' ? 'primary' : 'success'}
                size="small"
              />
            </Typography>
          </Grid>
          
          <Grid sx={{ gridColumn: 'span 4' }}>
            <Typography variant="subtitle1" gutterBottom>
              Quantidade
            </Typography>
            <Typography variant="body1">
              {call.amount} MWh
            </Typography>
          </Grid>
          
          <Grid sx={{ gridColumn: 'span 4' }}>
            <Typography variant="subtitle1" gutterBottom>
              Período de Fornecimento
            </Typography>
            <Typography variant="body1">
              {formatDate(call.startDate)} a {formatDate(call.endDate)}
            </Typography>
          </Grid>
          
          <Grid sx={{ gridColumn: 'span 4' }}>
            <Typography variant="subtitle1" gutterBottom>
              Prazo para Propostas
            </Typography>
            <Typography variant="body1" color={getRemainingDays(call.deadline) < 3 ? 'error' : 'inherit'}>
              {formatDate(call.deadline)} ({getRemainingDays(call.deadline)} dias restantes)
            </Typography>
          </Grid>
          
          <Grid sx={{ gridColumn: 'span 4' }}>
            <Typography variant="subtitle1" gutterBottom>
              Data de Publicação
            </Typography>
            <Typography variant="body1">
              {formatDate(call.createdAt)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      <Divider sx={{ my: 3 }} />
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Descrição
        </Typography>
        <Typography variant="body1" paragraph>
          {call.description || 'Nenhuma descrição disponível.'}
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Requisitos
        </Typography>
        <Typography variant="body1" paragraph>
          {call.requirements || 'Nenhum requisito específico.'}
        </Typography>
      </Paper>
      
      {/* Diálogo para envio de proposta */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Enviar Proposta</DialogTitle>
        <DialogContent>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          
          {submitSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {submitSuccess}
            </Alert>
          )}
          
          <DialogContentText sx={{ mb: 2 }}>
            Preencha os dados da sua proposta para a chamada "{call.title}".
          </DialogContentText>
          
          <Grid container spacing={2}>
            <Grid sx={{ gridColumn: 'span 6' }}>
              <TextField
                required
                label="Preço (R$/MWh)"
                name="price"
                value={proposalForm.price}
                onChange={handleFormChange}
                fullWidth
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
                margin="normal"
              />
            </Grid>
            
            <Grid sx={{ gridColumn: 'span 6' }}>
              <TextField
                required
                label="Quantidade (MWh)"
                name="amount"
                value={proposalForm.amount}
                onChange={handleFormChange}
                fullWidth
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">MWh</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 1 }}
                margin="normal"
              />
            </Grid>
            
            <Grid sx={{ gridColumn: 'span 6' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  label="Data de Entrega"
                  value={proposalForm.deliveryDate}
                  onChange={(date) => setProposalForm(prev => ({ ...prev, deliveryDate: date }))}
                  slotProps={{ textField: { margin: 'normal', fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid sx={{ gridColumn: 'span 6' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  label="Válida até"
                  value={proposalForm.validUntil}
                  onChange={(date) => setProposalForm(prev => ({ ...prev, validUntil: date }))}
                  slotProps={{ textField: { margin: 'normal', fullWidth: true } }}
                  minDate={new Date()}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid sx={{ gridColumn: 'span 12' }}>
              <TextField
                label="Comentários"
                name="comments"
                value={proposalForm.comments}
                onChange={handleFormChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmitProposal} 
            variant="contained" 
            color="primary"
            disabled={submitting || !proposalForm.price || !proposalForm.amount}
          >
            {submitting ? <CircularProgress size={24} /> : 'Enviar Proposta'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CallDetail; 