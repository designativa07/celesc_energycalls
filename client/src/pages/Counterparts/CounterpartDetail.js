import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Check as CheckIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import api from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';

// Componente TabPanel para exibir o conteúdo das abas
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Função para formatar telefone
const formatPhone = (phone) => {
  // Remove todos os caracteres não numéricos
  const numbers = phone.replace(/\D/g, '');
  
  // Verifica o tamanho para determinar o formato (celular ou fixo)
  if (numbers.length === 11) {
    // Celular: (XX) XXXXX-XXXX
    return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (numbers.length === 10) {
    // Fixo: (XX) XXXX-XXXX
    return numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }
  
  // Se não for um formato padrão, retorna como está
  return phone;
};

const CounterpartDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counterpart, setCounterpart] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [proposals, setProposals] = useState([]);
  const [proposalsLoading, setProposalsLoading] = useState(false);
  
  // Estado para diálogo de homologação
  const [homologateDialogOpen, setHomologateDialogOpen] = useState(false);
  
  // Estado para formulário de edição
  const [formData, setFormData] = useState({
    companyName: '',
    cnpj: '',
    contactName: '',
    email: '',
    phone: '',
    active: true,
    notes: ''
  });
  
  const [accessCode, setAccessCode] = useState('');
  const [generatingCode, setGeneratingCode] = useState(false);
  const [accessCodeError, setAccessCodeError] = useState('');
  const [accessCodeSuccess, setAccessCodeSuccess] = useState('');
  
  // Carregar dados ao montar o componente
  useEffect(() => {
    const fetchCounterpartDetails = async () => {
      setLoading(true);
      setError(null);
      
      // Evita a chamada API quando estamos na rota de criação
      if (id === 'create') {
        setLoading(false);
        return;
      }
      
      try {
        const response = await api.get(`/counterparts/${id}`);
        setCounterpart(response.data);
        setFormData({
          companyName: response.data.companyName || '',
          cnpj: response.data.cnpj || '',
          contactName: response.data.contactName || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          active: response.data.active !== undefined ? response.data.active : true,
          notes: response.data.notes || ''
        });
      } catch (error) {
        setError('Erro ao buscar detalhes da contraparte. Por favor, tente novamente.');
        console.error('Erro ao buscar contraparte:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCounterpartProposals = async () => {
      setProposalsLoading(true);
      
      // Evita a chamada API quando estamos na rota de criação
      if (id === 'create') {
        setProposalsLoading(false);
        return;
      }
      
      try {
        const response = await api.get(`/proposals/counterpart/${id}`);
        setProposals(response.data);
      } catch (error) {
        console.error('Erro ao buscar propostas:', error);
      } finally {
        setProposalsLoading(false);
      }
    };

    fetchCounterpartDetails();
    fetchCounterpartProposals();
  }, [id]);
  
  // Gerenciamento de abas
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await api.put(`/counterparts/${id}`, formData);
      setIsEditing(false);
      fetchCounterpartDetails();
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Erro ao atualizar contraparte. Por favor, tente novamente.'
      );
      console.error('Erro ao atualizar contraparte:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Função para homologar contraparte
  const handleHomologate = async () => {
    setLoading(true);
    
    try {
      await api.patch(`/counterparts/${id}/homologate`);
      setHomologateDialogOpen(false);
      fetchCounterpartDetails();
    } catch (error) {
      setError('Erro ao homologar contraparte. Por favor, tente novamente.');
      console.error('Erro ao homologar contraparte:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Função para gerar código de acesso
  const handleGenerateAccessCode = async () => {
    setGeneratingCode(true);
    setAccessCodeError('');
    setAccessCodeSuccess('');
    
    try {
      const response = await api.post(`/counterpart-auth/${id}/generate-access-code`);
      setAccessCode(response.data.accessCode);
      setAccessCodeSuccess('Código de acesso gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar código de acesso:', error);
      setAccessCodeError(
        error.response?.data?.message || 
        'Erro ao gerar código de acesso. Por favor, tente novamente.'
      );
    } finally {
      setGeneratingCode(false);
    }
  };
  
  // Função para formatar CNPJ
  const formatCNPJ = (cnpj) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };
  
  // Função para formatar data
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Função para formatar data e hora
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Função para obter rótulo de status da proposta
  const getProposalStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'accepted': return 'Aceita';
      case 'rejected': return 'Rejeitada';
      default: return status;
    }
  };
  
  // Função para obter cor do status da proposta
  const getProposalStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };
  
  // Função para verificar permissões
  const canEdit = () => {
    if (!user) return false;
    return user.role === 'admin' || user.role === 'manager';
  };
  
  const canHomologate = () => {
    if (!counterpart || !user) return false;
    return (user.role === 'admin' || user.role === 'manager') && !counterpart.homologated;
  };
  
  // Renderização condicional para carregamento
  if (loading && !counterpart) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress />
      </Box>
    );
  }
  
  // Renderização se ocorrer um erro
  if (error && !counterpart) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }
  
  if (!counterpart) {
    return (
      <Alert severity="info">
        Contraparte não encontrada.
      </Alert>
    );
  }
  
  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          {isEditing ? 'Editar Contraparte' : 'Detalhes da Contraparte'}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isEditing ? (
            <>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Salvar'}
              </Button>
            </>
          ) : (
            <>
              {canEdit() && (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </Button>
              )}
              {canHomologate() && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CheckIcon />}
                  onClick={() => setHomologateDialogOpen(true)}
                >
                  Homologar
                </Button>
              )}
            </>
          )}
        </Box>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Informações básicas */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              Informações Básicas
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} sx={{ p: 1, mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Razão Social
            </Typography>
            <Typography variant="body1" gutterBottom>
              {counterpart.companyName}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} sx={{ p: 1, mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              CNPJ
            </Typography>
            <Typography variant="body1" gutterBottom>
              {formatCNPJ(counterpart.cnpj)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} sx={{ p: 1, mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Nome do Contato
            </Typography>
            <Typography variant="body1" gutterBottom>
              {counterpart.contactName || '-'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} sx={{ p: 1, mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Email
            </Typography>
            <Typography variant="body1" gutterBottom>
              {counterpart.email}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} sx={{ p: 1, mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Telefone
            </Typography>
            <Typography variant="body1" gutterBottom>
              {counterpart.phone ? formatPhone(counterpart.phone) : '-'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} sx={{ p: 1, mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Website
            </Typography>
            <Typography variant="body1" gutterBottom>
              {counterpart.website || '-'}
            </Typography>
          </Grid>
          
          {/* Endereço */}
          <Grid item xs={12}>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" gutterBottom sx={{ mb: 2, mt: 2 }}>
              Endereço
            </Typography>
          </Grid>
          
          <Grid item xs={12} sx={{ p: 1, mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              {counterpart.address ? (
                <>
                  {counterpart.address.street}, {counterpart.address.number}
                  {counterpart.address.complement && ` - ${counterpart.address.complement}`}
                  <br />
                  {counterpart.address.neighborhood}, {counterpart.address.city} - {counterpart.address.state}
                  <br />
                  CEP: {counterpart.address.zipCode}
                </>
              ) : (
                'Endereço não cadastrado'
              )}
            </Typography>
          </Grid>
          
          {/* Informações adicionais */}
          <Grid item xs={12}>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" gutterBottom sx={{ mb: 2, mt: 2 }}>
              Informações Adicionais
            </Typography>
          </Grid>
          
          <Grid item xs={12} sx={{ p: 1, mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Observações
            </Typography>
            <Typography variant="body1" gutterBottom>
              {counterpart.notes || 'Nenhuma observação cadastrada.'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {!isEditing && (
        <>
          <Box sx={{ mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Propostas" sx={{ fontWeight: 'bold' }} />
              <Tab label="Documentos" sx={{ fontWeight: 'bold' }} />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <Paper>
              {proposalsLoading ? (
                <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress />
                </Box>
              ) : proposals.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Chamada</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Valor (R$)</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Quantidade (MWh)</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Data de Envio</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {proposals.map((proposal) => (
                        <TableRow key={proposal.id} 
                          sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                        >
                          <TableCell sx={{ py: 2 }}>{proposal.EnergyCall?.title || '—'}</TableCell>
                          <TableCell sx={{ py: 2 }}>
                            {proposal.EnergyCall?.type === 'buy' ? 'Compra' : 'Venda'}
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            {proposal.price.toLocaleString('pt-BR', { 
                              style: 'currency', 
                              currency: 'BRL' 
                            })}
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>{proposal.amount}</TableCell>
                          <TableCell sx={{ py: 2 }}>{formatDateTime(proposal.receivedAt)}</TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Chip 
                              label={getProposalStatusLabel(proposal.status)} 
                              color={getProposalStatusColor(proposal.status)} 
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ py: 2 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => navigate(`/calls/${proposal.energyCallId}`)}
                            >
                              Ver Chamada
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Nenhuma proposta enviada por esta contraparte.
                  </Typography>
                </Box>
              )}
            </Paper>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="body1" color="text.secondary" align="center">
                Funcionalidade de documentos não implementada.
              </Typography>
            </Paper>
          </TabPanel>
        </>
      )}
      
      {/* Diálogo de homologação */}
      <Dialog open={homologateDialogOpen} onClose={() => setHomologateDialogOpen(false)}>
        <DialogTitle>Homologar Contraparte</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja homologar esta contraparte? 
            Uma vez homologada, a contraparte estará habilitada a enviar propostas para chamadas de energia.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHomologateDialogOpen(false)}>Cancelar</Button>
          <Button 
            onClick={handleHomologate}
            color="primary" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Confirmar Homologação'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Box mt={4}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Acesso ao Portal da Contraparte
          </Typography>
          
          {accessCodeError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {accessCodeError}
            </Alert>
          )}
          
          {accessCodeSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {accessCodeSuccess}
            </Alert>
          )}
          
          <Box display="flex" alignItems="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateAccessCode}
              disabled={generatingCode || !counterpart.homologated}
              sx={{ mr: 2 }}
            >
              {generatingCode ? 'Gerando...' : 'Gerar Código de Acesso'}
            </Button>
            
            {accessCode && (
              <Typography variant="h5" fontFamily="monospace" color="primary.main">
                {accessCode}
              </Typography>
            )}
          </Box>
          
          {!counterpart.homologated && (
            <Typography variant="body2" color="text.secondary" mt={2}>
              A contraparte precisa estar homologada para gerar um código de acesso.
            </Typography>
          )}
          
          <Typography variant="body2" color="text.secondary" mt={2}>
            O código de acesso permite que a contraparte acesse o portal para enviar propostas.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default CounterpartDetail; 