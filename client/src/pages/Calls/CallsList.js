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
  Alert,
  IconButton as MuiIconButton,
  Collapse,
  Tooltip,
  Skeleton,
  Container
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  SortByAlpha as SortIcon,
  Clear as ClearIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  ErrorOutline as ErrorOutlineIcon
} from '@mui/icons-material';
import api from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '@mui/material/styles';

const CallsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
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
  
  const fetchCalls = async () => {
    setInitialLoading(true);
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/calls');
      setCalls(response.data);
      setFilteredCalls(response.data);
    } catch (error) {
      setError('Erro ao carregar chamadas de energia. Por favor, tente novamente.');
      console.error('Erro ao buscar chamadas:', error);
      setCalls([]);
      setFilteredCalls([]);
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCalls();
  }, []);
  
  useEffect(() => {
    let result = [...calls];
    
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(call => 
        call.title.toLowerCase().includes(searchLower) ||
        (call.description && call.description.toLowerCase().includes(searchLower))
      );
    }
    
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
  
  const getStatusChipProps = (status) => {
    switch (status) {
      case 'draft': return { label: 'Rascunho', color: 'warning' };
      case 'open': return { label: 'Aberta', color: 'success' };
      case 'closed': return { label: 'Fechada', color: 'primary' };
      case 'completed': return { label: 'Concluída', color: 'info' };
      case 'canceled': return { label: 'Cancelada', color: 'error' };
      default: return { label: status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A', color: 'default' };
    }
  };
  
  const getTypeLabel = (type) => {
    if (type === 'buy') return 'Compra';
    if (type === 'sell') return 'Venda';
    return 'N/A';
  };
  
  const getEnergyTypeLabel = (energyType) => {
    if (energyType === 'conventional') return 'Convencional';
    if (energyType === 'incentivized') return 'Incentivada';
    if (energyType === 'renewable') return 'Renovável';
    return 'N/A';
  };
  
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
    setSortBy('deadline');
    setSortDirection('asc');
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  if (initialLoading) {
    return (
      <Box p={2}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" width={250} height={40} />
          <Skeleton variant="rectangular" width={150} height={40} />
        </Box>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}><Skeleton variant="rounded" height={56} /></Grid>
            <Grid item xs={12} md={2}><Skeleton variant="rounded" height={56} /></Grid>
            <Grid item xs={12} md={2}><Skeleton variant="rounded" height={56} /></Grid>
            <Grid item xs={12} md={2}><Skeleton variant="rounded" height={56} /></Grid>
            <Grid item xs={12} md={2}><Skeleton variant="rounded" height={56} /></Grid>
          </Grid>
        </Paper>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card variant="outlined">
                <CardContent sx={{ p: 2 }}>
                  <Skeleton variant="text" width="80%" height={28} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" width={100} height={22} sx={{ mb: 1.5, borderRadius: '4px' }} />
                  <Skeleton variant="text" width="60%" height={18} />
                  <Skeleton variant="text" width="70%" height={18} sx={{ mb: 1 }}/>
                </CardContent>
                <Divider/>
                <CardActions sx={{ p: 1.5, justifyContent: 'flex-end' }}>
                  <Skeleton variant="rounded" width={100} height={36} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error && !loading) {
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
            <Button variant="contained" onClick={fetchCalls} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Tentar Novamente'}
            </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Box p={2}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Chamadas de Energia
        </Typography>
        
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/calls/create')}
            size="large"
          >
            Nova Chamada
          </Button>
        )}
      </Box>
      
      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: showFilters ? 2 : 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>Filtros & Ordenação</Typography>
          <Button 
            onClick={toggleFilters} 
            variant="outlined"
            size="small"
            startIcon={<FilterListIcon />} 
            endIcon={showFilters ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          >
            {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
          </Button>
        </Stack>

        <Collapse in={showFilters}>
          <Grid container spacing={2.5} alignItems="flex-end" sx={{ pt: 2 }}>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Pesquisar por título ou descrição"
                variant="outlined"
                value={search}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                  endAdornment: search && (
                    <InputAdornment position="end">
                      <MuiIconButton onClick={() => setSearch('')} edge="end" size="small">
                        <ClearIcon fontSize="small" />
                      </MuiIconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select name="status" value={filters.status} label="Status" onChange={handleFilterChange}>
                  <MenuItem value=""><em>Todos</em></MenuItem>
                  <MenuItem value="draft">Rascunho</MenuItem>
                  <MenuItem value="open">Aberta</MenuItem>
                  <MenuItem value="closed">Fechada</MenuItem>
                  <MenuItem value="completed">Concluída</MenuItem>
                  <MenuItem value="canceled">Cancelada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Tipo de Chamada</InputLabel>
                <Select name="type" value={filters.type} label="Tipo de Chamada" onChange={handleFilterChange}>
                  <MenuItem value=""><em>Ambos</em></MenuItem>
                  <MenuItem value="buy">Compra</MenuItem>
                  <MenuItem value="sell">Venda</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}> 
                <Button 
                    fullWidth 
                    onClick={handleResetFilters} 
                    variant="text" 
                    color="inherit" 
                    startIcon={<ClearIcon />}
                    sx={{ height: '56px'}}
                >
                    Limpar Filtros
                </Button>
            </Grid>

            <Grid item xs={12} md={3}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel>Ordenar Por</InputLabel>
                    <Select name="sortBy" value={sortBy} label="Ordenar Por" onChange={handleSortChange}>
                        <MenuItem value="deadline">Prazo Final</MenuItem>
                        <MenuItem value="createdAt">Data de Criação</MenuItem>
                        <MenuItem value="title">Título</MenuItem>
                        <MenuItem value="status">Status</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
                <Tooltip title={sortDirection === 'asc' ? "Ordem Ascendente" : "Ordem Descendente" }>
                    <Button 
                        fullWidth 
                        variant="outlined" 
                        onClick={handleSortDirectionToggle} 
                        startIcon={sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        sx={{ height: '56px'}}
                    >
                        {sortDirection === 'asc' ? 'ASC' : 'DESC'}
                    </Button>
                </Tooltip>
            </Grid>
          </Grid>
        </Collapse>
      </Paper>

      {loading && filteredCalls.length > 0 && (
        <Box display="flex" justifyContent="center" sx={{my: 3}}><CircularProgress /></Box>
      )}

      {!loading && filteredCalls.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhuma chamada encontrada
          </Typography>
          <Typography color="text.secondary" sx={{mb:2}}>
            Tente ajustar seus filtros ou crie uma nova chamada.
          </Typography>
          <Button onClick={handleResetFilters} variant='outlined' sx={{mr:1}}>Limpar Filtros</Button>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <Button variant="contained" onClick={() => navigate('/calls/create')}>
              Criar Nova Chamada
            </Button>
          )}
        </Paper>
      )}

      <Grid container spacing={3}>
        {!loading && filteredCalls.map(call => {
          const statusProps = getStatusChipProps(call.status);
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={call.id}>
              <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderColor: theme.palette.divider }}>
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography variant="h6" component="div" title={call.title} noWrap sx={{ fontWeight: 600, mb: 0.5 }}>
                    {call.title}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                    <Chip label={statusProps.label} color={statusProps.color} size="small" sx={{ fontWeight: 500 }} />
                    <Chip label={getTypeLabel(call.type)} size="small" variant="outlined" />
                  </Stack>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Prazo: {formatDate(call.deadline)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Energia: {getEnergyTypeLabel(call.energyType)}
                  </Typography>
                  {call.volumeMwm && <Typography variant="body2" color="text.secondary">Volume: {call.volumeMwm} MWm</Typography>}
                </CardContent>
                <Divider />
                <CardActions sx={{ p: 1.5, justifyContent: 'flex-end' }}>
                  <Button 
                    variant="contained"
                    color="primary"
                    size="medium"
                    onClick={() => navigate(`/calls/${call.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CallsList; 