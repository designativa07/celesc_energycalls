import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid,
  Card, 
  CardContent, 
  CardActions,
  Stack, 
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  SortByAlpha as SortIcon
} from '@mui/icons-material';
import api from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';

const CallsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calls, setCalls] = useState([]);
  const [filteredCalls, setFilteredCalls] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    energyType: '',
    isExtraordinary: ''
  });
  const [sortBy, setSortBy] = useState('deadline');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Função para buscar as chamadas de energia
  const fetchCalls = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/calls');
      setCalls(response.data);
      setFilteredCalls(response.data);
    } catch (error) {
      setError('Erro ao carregar chamadas de energia. Por favor, tente novamente.');
      console.error('Erro ao buscar chamadas:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Carregar chamadas ao montar o componente
  useEffect(() => {
    fetchCalls();
  }, []);
  
  // Filtrar e ordenar chamadas
  useEffect(() => {
    let result = [...calls];
    
    // Aplicar filtro de pesquisa
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(call => 
        call.title.toLowerCase().includes(searchLower) ||
        (call.description && call.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Aplicar filtros
    if (filters.status) {
      result = result.filter(call => call.status === filters.status);
    }
    
    if (filters.type) {
      result = result.filter(call => call.type === filters.type);
    }
    
    if (filters.energyType) {
      result = result.filter(call => call.energyType === filters.energyType);
    }
    
    if (filters.isExtraordinary !== '') {
      const isExtraordinary = filters.isExtraordinary === 'true';
      result = result.filter(call => call.isExtraordinary === isExtraordinary);
    }
    
    // Ordenar resultado
    result.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'title':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case 'deadline':
          valueA = new Date(a.deadline);
          valueB = new Date(b.deadline);
          break;
        case 'createdAt':
          valueA = new Date(a.createdAt);
          valueB = new Date(b.createdAt);
          break;
        case 'status':
          valueA = a.status;
          valueB = b.status;
          break;
        default:
          valueA = new Date(a.deadline);
          valueB = new Date(b.deadline);
      }
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    setFilteredCalls(result);
  }, [calls, search, filters, sortBy, sortDirection]);
  
  // Funções auxiliares para formatar dados
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'warning';
      case 'open': return 'success';
      case 'closed': return 'primary';
      case 'completed': return 'secondary';
      case 'canceled': return 'error';
      default: return 'default';
    }
  };
  
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
  
  const getTypeLabel = (type) => {
    return type === 'buy' ? 'Compra' : 'Venda';
  };
  
  const getEnergyTypeLabel = (energyType) => {
    return energyType === 'conventional' ? 'Convencional' : 'Incentivada';
  };
  
  // Manipuladores de eventos
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  const handleSortDirectionToggle = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  const handleResetFilters = () => {
    setSearch('');
    setFilters({
      status: '',
      type: '',
      energyType: '',
      isExtraordinary: ''
    });
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Renderização condicional para carregamento
  if (loading && calls.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Chamadas de Energia
        </Typography>
        
        {(user.role === 'admin' || user.role === 'manager') && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/calls/create')}
          >
            Nova Chamada
          </Button>
        )}
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid flex={1}>
            <TextField
              fullWidth
              placeholder="Buscar chamadas..."
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          
          <Grid flex={1}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button 
                variant={showFilters ? "contained" : "outlined"} 
                startIcon={<FilterIcon />}
                onClick={toggleFilters}
                sx={{ flexShrink: 0 }}
              >
                Filtros
              </Button>
              
              <FormControl sx={{ flexGrow: 1, minWidth: 120 }}>
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={sortBy}
                  label="Ordenar por"
                  onChange={handleSortChange}
                  size="small"
                >
                  <MenuItem value="deadline">Prazo</MenuItem>
                  <MenuItem value="title">Título</MenuItem>
                  <MenuItem value="createdAt">Data de criação</MenuItem>
                  <MenuItem value="status">Status</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                variant="outlined" 
                onClick={handleSortDirectionToggle}
                sx={{ flexShrink: 0 }}
              >
                <SortIcon sx={{ transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none' }} />
              </Button>
            </Box>
          </Grid>
          
          {showFilters && (
            <>
              <Grid flex={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              
              <Grid flex={1}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={filters.status}
                    label="Status"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="draft">Rascunho</MenuItem>
                    <MenuItem value="open">Aberta</MenuItem>
                    <MenuItem value="closed">Fechada</MenuItem>
                    <MenuItem value="completed">Concluída</MenuItem>
                    <MenuItem value="canceled">Cancelada</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid flex={1}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    name="type"
                    value={filters.type}
                    label="Tipo"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="buy">Compra</MenuItem>
                    <MenuItem value="sell">Venda</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid flex={1}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo de Energia</InputLabel>
                  <Select
                    name="energyType"
                    value={filters.energyType}
                    label="Tipo de Energia"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="conventional">Convencional</MenuItem>
                    <MenuItem value="incentivized">Incentivada</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid flex={1}>
                <FormControl fullWidth size="small">
                  <InputLabel>Extraordinária</InputLabel>
                  <Select
                    name="isExtraordinary"
                    value={filters.isExtraordinary}
                    label="Extraordinária"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="true">Sim</MenuItem>
                    <MenuItem value="false">Não</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid flex={12}>
                <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button variant="text" onClick={handleResetFilters}>
                    Limpar Filtros
                  </Button>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {filteredCalls.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Nenhuma chamada de energia encontrada.
          </Typography>
          {search || Object.values(filters).some(value => value !== '') ? (
            <Button variant="text" onClick={handleResetFilters} sx={{ mt: 2 }}>
              Limpar Filtros
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Crie uma nova chamada para começar.
            </Typography>
          )}
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {filteredCalls.map(call => (
            <Grid item xs={12} sm={6} md={4} key={call.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip 
                      label={getTypeLabel(call.type)} 
                      size="small" 
                      color={call.type === 'buy' ? 'info' : 'secondary'} 
                    />
                    <Chip 
                      label={getStatusLabel(call.status)} 
                      size="small" 
                      color={getStatusColor(call.status)} 
                    />
                    {call.isExtraordinary && (
                      <Chip 
                        label="Extraordinária" 
                        size="small" 
                        variant="outlined" 
                      />
                    )}
                  </Stack>
                  
                  <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                    {call.title}
                  </Typography>
                  
                  <Box mt={2}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Energia:</strong> {getEnergyTypeLabel(call.energyType)}
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Quantidade:</strong> {call.amount} MWh
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Período:</strong> {formatDate(call.startDate)} a {formatDate(call.endDate)}
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary">
                      <strong>Prazo:</strong> {formatDateTime(call.deadline)}
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
                    Ver detalhes
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CallsList; 