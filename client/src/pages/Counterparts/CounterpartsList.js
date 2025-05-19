import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Business as BusinessIcon,
  Check as CheckIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import api from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';

// Lista de estados brasileiros para o filtro
const statesList = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

const CounterpartsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counterparts, setCounterparts] = useState([]);
  const [filteredCounterparts, setFilteredCounterparts] = useState([]);
  
  // Estados de filtro
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    active: '',
    homologated: '',
    state: '',
    contractModel: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('companyName');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Função para buscar contrapartes
  const fetchCounterparts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/counterparts');
      setCounterparts(response.data);
      setFilteredCounterparts(response.data);
    } catch (error) {
      setError('Erro ao buscar contrapartes. Por favor, tente novamente.');
      console.error('Erro ao buscar contrapartes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Carregar contrapartes ao montar o componente
  useEffect(() => {
    fetchCounterparts();
  }, []);
  
  // Filtrar contrapartes
  useEffect(() => {
    let result = [...counterparts];
    
    // Aplicar filtro de busca
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(counterpart => 
        counterpart.companyName.toLowerCase().includes(searchLower) ||
        counterpart.cnpj.includes(search) ||
        (counterpart.contactName && counterpart.contactName.toLowerCase().includes(searchLower)) ||
        (counterpart.email && counterpart.email.toLowerCase().includes(searchLower))
      );
    }
    
    // Aplicar filtros
    if (filters.active !== '') {
      const isActive = filters.active === 'true';
      result = result.filter(counterpart => counterpart.active === isActive);
    }
    
    if (filters.homologated !== '') {
      const isHomologated = filters.homologated === 'true';
      result = result.filter(counterpart => counterpart.homologated === isHomologated);
    }
    
    if (filters.state !== '') {
      result = result.filter(counterpart => counterpart.state === filters.state);
    }
    
    if (filters.contractModel !== '') {
      result = result.filter(counterpart => counterpart.contractModel === filters.contractModel);
    }
    
    setFilteredCounterparts(result);
  }, [counterparts, search, filters]);
  
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
  
  const handleResetFilters = () => {
    setSearch('');
    setFilters({
      active: '',
      homologated: '',
      state: '',
      contractModel: ''
    });
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  const handleSortDirectionToggle = () => {
    setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
  };
  
  // Função para homologar contraparte
  const handleHomologate = async (id) => {
    try {
      await api.patch(`/counterparts/${id}/homologate`);
      fetchCounterparts();
    } catch (error) {
      setError('Erro ao homologar contraparte. Por favor, tente novamente.');
      console.error('Erro ao homologar contraparte:', error);
    }
  };
  
  // Formatar CNPJ
  const formatCNPJ = (cnpj) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };
  
  // Renderização condicional para carregamento
  if (loading && counterparts.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ mb: 0, fontWeight: 600 }}>
          Contrapartes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/counterparts/create')}
          sx={{ mt: { xs: 0, sm: 1 }, mb: { xs: 0, sm: 1 }, position: 'relative', zIndex: 1 }}
        >
          + Nova Contraparte
        </Button>
      </Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Buscar contrapartes..."
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ ml: 1, mr: 1 }} />
                  </InputAdornment>
                ),
                sx: { pl: 1.5 }
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={toggleFilters}
              sx={{ minWidth: 120, height: 40, ml: { md: 1 }, mt: { xs: 1, md: 0 } }}
            >
              Filtros
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={sortBy}
                label="Ordenar por"
                onChange={handleSortChange}
                size="small"
              >
                <MenuItem value="companyName">Empresa</MenuItem>
                <MenuItem value="cnpj">CNPJ</MenuItem>
                <MenuItem value="createdAt">Data de cadastro</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {filteredCounterparts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Nenhuma contraparte encontrada.
          </Typography>
          {search || Object.values(filters).some(value => value !== '') ? (
            <Button variant="text" onClick={handleResetFilters} sx={{ mt: 2 }}>
              Limpar Filtros
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Crie uma nova contraparte para começar.
            </Typography>
          )}
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {filteredCounterparts.map(counterpart => (
            <Grid item xs={12} sm={6} md={4} key={counterpart.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                    <Box display="flex" alignItems="center">
                      <BusinessIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" component="div">
                        {counterpart.companyName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        label={counterpart.active ? 'Ativo' : 'Inativo'} 
                        color={counterpart.active ? 'success' : 'error'} 
                        size="small"
                      />
                      {counterpart.homologated ? (
                        <Chip 
                          label="Homologada" 
                          color="primary" 
                          size="small" 
                          icon={<CheckIcon />}
                        />
                      ) : (
                        <Chip 
                          label="Não Homologada" 
                          variant="outlined" 
                          size="small"
                        />
                      )}
                    </Box>
                  </Box>
                  
                  <Box mt={2}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>CNPJ:</strong> {formatCNPJ(counterpart.cnpj)}
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Contato:</strong> {counterpart.contactName || 'Não informado'}
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Email:</strong> {counterpart.email || 'Não informado'}
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary">
                      <strong>Telefone:</strong> {counterpart.phone || 'Não informado'}
                    </Typography>
                    
                    {counterpart.homologated && counterpart.homologationDate && (
                      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                        <strong>Homologado em:</strong> {new Date(counterpart.homologationDate).toLocaleDateString('pt-BR')}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
                
                <CardActions sx={{ px: 3, pb: 3, pt: 1 }}>
                  <Button 
                    size="medium"
                    variant="outlined"
                    onClick={() => navigate(`/counterparts/${counterpart.id}`)}
                    fullWidth={!(!counterpart.homologated && (user.role === 'admin' || user.role === 'manager'))}
                  >
                    Ver detalhes
                  </Button>
                  
                  {!counterpart.homologated && (user.role === 'admin' || user.role === 'manager') && (
                    <Button 
                      size="medium"
                      color="primary"
                      onClick={() => handleHomologate(counterpart.id)}
                    >
                      Homologar
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CounterpartsList; 