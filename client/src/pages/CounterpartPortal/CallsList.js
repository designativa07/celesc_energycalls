import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import api from '../../api/api';

const CallsList = () => {
  const [calls, setCalls] = useState([]);
  const [filteredCalls, setFilteredCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [energyTypeFilter, setEnergyTypeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const navigate = useNavigate();
  
  // Buscar chamadas disponíveis
  useEffect(() => {
    const fetchCalls = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await api.get('/counterpart-portal/calls');
        setCalls(response.data);
        setFilteredCalls(response.data);
      } catch (error) {
        console.error('Erro ao buscar chamadas:', error);
        setError(
          error.response?.data?.message || 
          'Erro ao carregar chamadas. Por favor, tente novamente.'
        );
      } finally {
        setLoading(false);
      }
    };
    
    fetchCalls();
  }, []);
  
  // Aplicar filtros quando mudarem
  useEffect(() => {
    // Função para filtrar chamadas
    const applyFilters = () => {
      let result = [...calls];
      
      // Filtrar por termo de busca
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(call => 
          call.title.toLowerCase().includes(term) || 
          (call.description && call.description.toLowerCase().includes(term))
        );
      }
      
      // Filtrar por tipo de energia
      if (energyTypeFilter !== 'all') {
        result = result.filter(call => call.energyType === energyTypeFilter);
      }
      
      // Filtrar por tipo de chamada
      if (typeFilter !== 'all') {
        result = result.filter(call => call.type === typeFilter);
      }
      
      setFilteredCalls(result);
    };
    
    applyFilters();
  }, [searchTerm, energyTypeFilter, typeFilter, calls]);
  
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
  
  // Navegar para detalhes da chamada
  const handleViewCallDetails = (callId) => {
    navigate(`/counterpart-portal/calls/${callId}`);
  };
  
  // Limpar filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setEnergyTypeFilter('all');
    setTypeFilter('all');
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
      <Typography variant="h4" gutterBottom>
        Chamadas Disponíveis
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Filtros */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid sx={{ gridColumn: 'span 6' }}>
            <TextField
              fullWidth
              label="Buscar chamadas"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          
          <Grid sx={{ gridColumn: 'span 2' }}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Energia</InputLabel>
              <Select
                value={energyTypeFilter}
                label="Tipo de Energia"
                onChange={(e) => setEnergyTypeFilter(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="conventional">Convencional</MenuItem>
                <MenuItem value="incentivized">Incentivada</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid sx={{ gridColumn: 'span 2' }}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Chamada</InputLabel>
              <Select
                value={typeFilter}
                label="Tipo de Chamada"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="buy">Compra</MenuItem>
                <MenuItem value="sell">Venda</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid sx={{ gridColumn: 'span 2' }}>
            <Button 
              variant="outlined" 
              onClick={handleClearFilters}
              fullWidth
            >
              Limpar Filtros
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Lista de chamadas */}
      {filteredCalls.length > 0 ? (
        <Grid container spacing={3}>
          {filteredCalls.map((call) => (
            <Grid key={call.id} sx={{ gridColumn: 'span 4' }}>
              <Card elevation={2}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6">
                      {call.title}
                    </Typography>
                    <Chip 
                      label={call.energyType === 'conventional' ? 'Convencional' : 'Incentivada'} 
                      color={call.energyType === 'conventional' ? 'primary' : 'success'}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Tipo:</strong> {call.type === 'buy' ? 'Compra' : 'Venda'}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Quantidade:</strong> {call.amount} MWh
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Período:</strong> {formatDate(call.startDate)} a {formatDate(call.endDate)}
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
                      <strong>Prazo:</strong> {formatDate(call.deadline)}
                    </Typography>
                    <Chip
                      label={`${getRemainingDays(call.deadline)} dias restantes`}
                      color={getRemainingDays(call.deadline) < 3 ? 'error' : 'primary'}
                      size="small"
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => handleViewCallDetails(call.id)}
                  >
                    Ver Detalhes
                  </Button>
                  <Button 
                    size="small" 
                    variant="contained" 
                    color="primary"
                    onClick={() => handleViewCallDetails(call.id)}
                  >
                    Enviar Proposta
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Não há chamadas disponíveis que correspondam aos filtros selecionados.
          </Typography>
          {(searchTerm || energyTypeFilter !== 'all' || typeFilter !== 'all') && (
            <Button 
              variant="outlined" 
              onClick={handleClearFilters}
              sx={{ mt: 2 }}
            >
              Limpar Filtros
            </Button>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default CallsList; 