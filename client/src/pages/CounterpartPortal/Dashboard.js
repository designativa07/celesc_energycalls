import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  InsertInvitation as CalendarIcon,
  AttachMoney as MoneyIcon,
  Bolt as EnergyIcon
} from '@mui/icons-material';
import { useCounterpartAuth } from '../../contexts/CounterpartAuthContext';
import api from '../../api/api';

const CounterpartDashboard = () => {
  const [openCalls, setOpenCalls] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { counterpart } = useCounterpartAuth();
  const navigate = useNavigate();
  
  // Buscar dados ao carregar a página
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Buscar chamadas abertas
        const callsResponse = await api.get('/counterpart-portal/calls');
        
        // Buscar propostas da contraparte
        const proposalsResponse = await api.get('/counterpart-portal/my-proposals');
        
        setOpenCalls(callsResponse.data);
        setMyProposals(proposalsResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        setError('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
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
  
  // Renderizar indicador de tipo de energia
  const renderEnergyTypeIndicator = (type) => {
    const bgColor = type === 'conventional' ? '#1976d2' : '#2e7d32';
    
    return (
      <Box
        sx={{
          display: 'inline-block',
          bgcolor: bgColor,
          color: 'white',
          px: 1,
          py: 0.5,
          borderRadius: 1,
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}
      >
        {type === 'conventional' ? 'Convencional' : 'Incentivada'}
      </Box>
    );
  };
  
  // Status da proposta em português
  const getProposalStatus = (status) => {
    const statusMap = {
      pending: 'Pendente',
      accepted: 'Aceita',
      rejected: 'Rejeitada',
      expired: 'Expirada'
    };
    
    return statusMap[status] || status;
  };
  
  // Função para navegar para detalhes da chamada
  const handleViewCallDetails = (callId) => {
    navigate(`/counterpart-portal/calls/${callId}`);
  };
  
  // Função para navegar para lista de propostas
  const handleViewMyProposals = () => {
    navigate('/counterpart-portal/my-proposals');
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Typography variant="h4" gutterBottom>
        Bem-vindo, {counterpart?.companyName}
      </Typography>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid sx={{ gridColumn: 'span 4' }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <CalendarIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Chamadas Abertas</Typography>
            </Box>
            <Typography variant="h3" align="center" sx={{ my: 2 }}>
              {openCalls.length}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid sx={{ gridColumn: 'span 4' }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <MoneyIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Propostas Enviadas</Typography>
            </Box>
            <Typography variant="h3" align="center" sx={{ my: 2 }}>
              {myProposals.length}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid sx={{ gridColumn: 'span 4' }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <EnergyIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Propostas Aceitas</Typography>
            </Box>
            <Typography variant="h3" align="center" sx={{ my: 2 }}>
              {myProposals.filter(p => p.status === 'accepted').length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Chamadas abertas */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Chamadas Abertas
        </Typography>
        
        {openCalls.length > 0 ? (
          <Grid container spacing={3}>
            {openCalls.slice(0, 3).map((call) => (
              <Grid key={call.id} sx={{ gridColumn: 'span 4' }}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="h6" gutterBottom>
                        {call.title}
                      </Typography>
                      {renderEnergyTypeIndicator(call.energyType)}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Tipo: {call.type === 'buy' ? 'Compra' : 'Venda'}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Quantidade: {call.amount} MWh
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Período: {formatDate(call.startDate)} a {formatDate(call.endDate)}
                    </Typography>
                    
                    <Box 
                      mt={2} 
                      p={1} 
                      bgcolor="#f5f5f5" 
                      borderRadius={1}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2">
                        Prazo: {formatDate(call.deadline)}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color={getRemainingDays(call.deadline) < 3 ? 'error' : 'primary'}
                        fontWeight="bold"
                      >
                        {getRemainingDays(call.deadline)} dias restantes
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => handleViewCallDetails(call.id)}
                    >
                      Ver Detalhes
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Não há chamadas abertas no momento.
            </Typography>
          </Paper>
        )}
        
        {openCalls.length > 3 && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/counterpart-portal/calls')}
            >
              Ver todas as {openCalls.length} chamadas
            </Button>
          </Box>
        )}
      </Box>
      
      {/* Propostas recentes */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Minhas Propostas Recentes
        </Typography>
        
        {myProposals.length > 0 ? (
          <Grid container spacing={3}>
            {myProposals.slice(0, 3).map((proposal) => (
              <Grid key={proposal.id} sx={{ gridColumn: 'span 4' }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {proposal.EnergyCall.title}
                    </Typography>
                    
                    <Box mb={1} display="flex" alignItems="center">
                      <Box
                        sx={{
                          display: 'inline-block',
                          bgcolor: proposal.status === 'accepted' ? '#2e7d32' : 
                                  proposal.status === 'rejected' ? '#d32f2f' : 
                                  proposal.status === 'expired' ? '#757575' : 
                                  '#fb8c00',
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {getProposalStatus(proposal.status)}
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Preço: R$ {parseFloat(proposal.price).toFixed(2)} por MWh
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Quantidade: {proposal.amount} MWh
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Enviada em: {formatDate(proposal.receivedAt)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Você ainda não enviou nenhuma proposta.
            </Typography>
          </Paper>
        )}
        
        {myProposals.length > 0 && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Button 
              variant="outlined" 
              onClick={handleViewMyProposals}
            >
              Ver todas as minhas propostas
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CounterpartDashboard; 