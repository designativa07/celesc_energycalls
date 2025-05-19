import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  Container,
  Skeleton,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Grid from '@mui/material/Grid';
import api from '../api/api';
import { useTheme } from '@mui/material/styles';
import { 
  TrendingUp as TrendingUpIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  FactCheck as FactCheckIcon,
  Group as GroupIcon,
  ErrorOutline as ErrorOutlineIcon
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

// Função auxiliar para formatar datas
const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

const periodOptions = [
  { value: 'month', label: 'Mensal' },
  { value: 'week', label: 'Semanal' },
  { value: 'year', label: 'Anual' },
  { value: 'custom', label: 'Personalizado' },
];

const [period, setPeriod] = React.useState('month');
const [chartData, setChartData] = React.useState([
  { periodo: 'Jan/24', precoMedio: 250, quantidade: 1200 },
  { periodo: 'Fev/24', precoMedio: 230, quantidade: 900 },
  { periodo: 'Mar/24', precoMedio: 270, quantidade: 1500 },
  { periodo: 'Abr/24', precoMedio: 260, quantidade: 1100 },
]);

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
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
  
  // Função para obter a cor do status usando o tema
  const getStatusChipProps = (status) => {
    switch (status) {
      case 'draft':
        return { label: 'Rascunho', color: 'warning' };
      case 'open':
        return { label: 'Aberta', color: 'success' };
      case 'closed':
        return { label: 'Fechada', color: 'primary' };
      case 'completed':
        return { label: 'Concluída', color: 'info' };
      case 'canceled':
        return { label: 'Cancelada', color: 'error' };
      default:
        return { label: status.charAt(0).toUpperCase() + status.slice(1), color: 'default' };
    }
  };
  
  if (loading) {
    return (
      <Box p={2}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rectangular" width={150} height={36} />
        </Box>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="80%" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="50%" height={30} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
          
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          <Skeleton variant="text" width={250} height={30} />
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 2 }}>
                  <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" width={100} height={20} sx={{ mb: 2, borderRadius: '4px' }} />
                  <Skeleton variant="text" width="90%" height={18} />
                  <Skeleton variant="text" width="80%" height={18} sx={{ mb: 2 }} />
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Skeleton variant="rectangular" width="100%" height={36} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Oops! Algo deu errado.
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
        </Paper>
      </Container>
    );
  }
  
  const statItems = [
    { title: 'Chamadas Ativas', value: stats.activeCalls, icon: <TrendingUpIcon fontSize="large" color="primary"/>, color: theme.palette.primary.main },
    { title: 'Propostas Pendentes', value: stats.pendingProposals, icon: <AssignmentTurnedInIcon fontSize="large" color="secondary"/>, color: theme.palette.secondary.main },
    { title: 'Chamadas Concluídas', value: stats.completedCalls, icon: <FactCheckIcon fontSize="large" sx={{color: theme.palette.success.main }}/>, color: theme.palette.success.main },
    { title: 'Contrapartes', value: stats.counterparts, icon: <GroupIcon fontSize="large" sx={{color: theme.palette.info.main}}/>, color: theme.palette.info.main }
  ];

  return (
    <Box p={2}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Dashboard Principal
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/calls/create')}
          size="large"
        >
          Criar Nova Chamada
        </Button>
      </Box>
      
      {/* Cards de estatísticas */}
      <Grid container spacing={0} sx={{ mb: 4 }}>
        {statItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ display: 'flex', flexDirection: 'column', minHeight: 170, borderRadius: 0, mx: 2 }}>
              <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {item.title}
                  </Typography>
                  <Avatar sx={{ bgcolor: item.color, width: 48, height: 48, color: theme.palette.getContrastText(item.color) }}>
                    {item.icon}
                  </Avatar>
                </Box>
                <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: item.color, alignSelf: 'flex-start' }}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
        
      {/* Chamadas recentes */}
      <Card sx={{ p: {xs: 2, sm: 3}, mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
          Acompanhamento de Chamadas Recentes
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {recentCalls.length === 0 ? (
          <Box py={4} textAlign="center">
            <Typography variant="body1" color="text.secondary">
              Nenhuma chamada recente para exibir no momento.
            </Typography>
            <Button variant="text" onClick={() => navigate('/calls')} sx={{mt: 2}}>
                Ver todas as chamadas
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {recentCalls.map(call => {
              const statusProps = getStatusChipProps(call.status);
              return (
                <Grid item xs={12} sm={6} md={4} key={call.id}>
                  <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderColor: theme.palette.divider }}>
                    <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                      <Typography variant="h6" component="div" gutterBottom sx={{ mb: 1, fontWeight: 600, minHeight: '3em' }}>
                        {call.title}
                      </Typography>
                      <Chip 
                        label={statusProps.label} 
                        color={statusProps.color} 
                        size="small" 
                        sx={{ mb: 2, fontWeight: 500 }}
                      />
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Criada em: {formatDate(call.createdAt)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Prazo: {formatDate(call.deadline)}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ p: 2 }}>
                      <Button 
                        size="medium"
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/calls/${call.id}`)}
                        fullWidth
                      >
                        Ver Detalhes
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
        {recentCalls.length > 0 && (
            <Box textAlign="center" mt={4}>
                <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={() => navigate('/calls')}
                >
                    Ver Todas as Chamadas
                </Button>
            </Box>
        )}
      </Card>

      <Card sx={{ p: {xs: 2, sm: 3}, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Gráfico de Preço Médio e Quantidade de Energia Comprada
          </Typography>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Período</InputLabel>
            <Select
              value={period}
              label="Período"
              onChange={e => setPeriod(e.target.value)}
            >
              {periodOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" />
            <YAxis yAxisId="left" label={{ value: 'Preço Médio (R$/MWh)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Quantidade (MWh)', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="right" dataKey="quantidade" name="Quantidade (MWh)" fill="#1976d2" barSize={30} />
            <Line yAxisId="left" type="monotone" dataKey="precoMedio" name="Preço Médio (R$/MWh)" stroke="#ff9800" strokeWidth={3} dot />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
};

export default Dashboard; 