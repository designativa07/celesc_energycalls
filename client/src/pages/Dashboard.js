import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Divider,
  Container
} from '@mui/material';
import Grid from '@mui/material/Grid';
import api from '../api/api';

// Função auxiliar para formatar datas
const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    activeCalls: 0,
    pendingProposals: 0,
    completedCalls: 0,
    counterparts: 0
  });
  const [recentCalls, setRecentCalls] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Obter estatísticas básicas
        const statsResponse = await api.get('/calls/stats');
        
        // Obter chamadas recentes
        const callsResponse = await api.get('/calls', {
          params: {
            limit: 5,
            sort: 'createdAt',
            order: 'DESC'
          }
        });
        
        // Obter contagem de contrapartes
        const counterpartsResponse = await api.get('/counterparts/count');
        
        setStats({
          activeCalls: statsResponse.data.activeCalls || 0,
          pendingProposals: statsResponse.data.pendingProposals || 0,
          completedCalls: statsResponse.data.completedCalls || 0,
          counterparts: counterpartsResponse.data.count || 0
        });
        
        setRecentCalls(callsResponse.data.energyCalls || []);
      } catch (error) {
        setError('Erro ao carregar dados do dashboard');
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Função para obter o rótulo do status
  const getStatusLabel = (status) => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'open': return 'Aberta';
      case 'closed': return 'Fechada';
      case 'completed': return 'Concluída';
      case 'canceled': return 'Cancelada';
      default: return status;
    }
  };
  
  // Função para obter a cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return '#f0ad4e'; // warning
      case 'open': return '#5cb85c'; // success
      case 'closed': return '#0275d8'; // primary
      case 'completed': return '#5bc0de'; // info
      case 'canceled': return '#d9534f'; // danger
      default: return '#777'; // secondary
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
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
  
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/calls/new')}
        >
          Nova Chamada
        </Button>
      </Box>
      
      {/* Cards de estatísticas */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 160 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chamadas Ativas
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, mt: 2 }}>
              {stats.activeCalls}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 160 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Propostas Pendentes
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, mt: 2 }}>
              {stats.pendingProposals}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 160 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chamadas Concluídas
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, mt: 2 }}>
              {stats.completedCalls}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 160 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Contrapartes
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, mt: 2 }}>
              {stats.counterparts}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
        
      {/* Chamadas recentes */}
      <Paper sx={{ p: 4, mt: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Chamadas Recentes
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
        {recentCalls.length === 0 ? (
          <Box py={3}>
            <Typography variant="body1" color="text.secondary" align="center">
              Nenhuma chamada encontrada.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {recentCalls.map(call => (
              <Grid item xs={12} sm={6} md={4} key={call.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" component="div" gutterBottom sx={{ mb: 2 }}>
                      {call.title}
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'inline-block',
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        backgroundColor: getStatusColor(call.status),
                        color: 'white',
                        fontSize: '0.875rem',
                        mb: 3
                      }}
                    >
                      {getStatusLabel(call.status)}
                    </Box>
                    <Box mt={2}>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        Criada em: {formatDate(call.createdAt)}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Prazo: {formatDate(call.deadline)}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ px: 3, pb: 3, pt: 1 }}>
                    <Button 
                      size="medium"
                      variant="outlined"
                      onClick={() => navigate(`/calls/${call.id}`)}
                      fullWidth
                    >
                      Ver Detalhes
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard; 