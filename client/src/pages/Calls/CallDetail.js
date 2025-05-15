import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
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
  DialogTitle,
  TextField
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
  Description as FileIcon
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

const CallDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [call, setCall] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Estados para diálogos
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [registrationInfo, setRegistrationInfo] = useState('');
  
  // Função para buscar os detalhes da chamada
  const fetchCallDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/calls/${id}`);
      setCall(response.data);
    } catch (error) {
      setError('Erro ao buscar detalhes da chamada. Por favor, tente novamente.');
      console.error('Erro ao buscar chamada:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Carregar chamada ao montar o componente
  useEffect(() => {
    fetchCallDetails();
  }, [id]);
  
  // Gerenciamento de abas
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Formatação de datas
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
  
  // Funções auxiliares para exibição de rótulos
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
  
  const getTypeLabel = (type) => {
    return type === 'buy' ? 'Compra' : 'Venda';
  };
  
  const getEnergyTypeLabel = (energyType) => {
    return energyType === 'conventional' ? 'Convencional' : 'Incentivada';
  };
  
  const getProposalStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'accepted': return 'Aceita';
      case 'rejected': return 'Rejeitada';
      default: return status;
    }
  };
  
  const getProposalStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };
  
  // Funções de ação
  const handlePublish = async () => {
    setLoading(true);
    
    try {
      await api.patch(`/calls/${id}/publish`);
      fetchCallDetails();
    } catch (error) {
      setError('Erro ao publicar chamada. Por favor, tente novamente.');
      console.error('Erro ao publicar chamada:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = async () => {
    setLoading(true);
    
    try {
      await api.patch(`/calls/${id}/cancel`, { reason: cancelReason });
      setCancelDialogOpen(false);
      fetchCallDetails();
    } catch (error) {
      setError('Erro ao cancelar chamada. Por favor, tente novamente.');
      console.error('Erro ao cancelar chamada:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = async () => {
    setLoading(true);
    
    try {
      await api.patch(`/calls/${id}/close`, {
        winningProposalId: selectedProposal
      });
      setCloseDialogOpen(false);
      fetchCallDetails();
    } catch (error) {
      setError('Erro ao fechar chamada. Por favor, tente novamente.');
      console.error('Erro ao fechar chamada:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegisterCCEE = async () => {
    setLoading(true);
    
    try {
      await api.patch(`/calls/${id}/register-ccee`, {
        registrationInfo
      });
      setRegisterDialogOpen(false);
      fetchCallDetails();
    } catch (error) {
      setError('Erro ao registrar chamada na CCEE. Por favor, tente novamente.');
      console.error('Erro ao registrar chamada na CCEE:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateReport = async () => {
    try {
      window.open(`/api/calls/${id}/report`, '_blank');
    } catch (error) {
      setError('Erro ao gerar relatório. Por favor, tente novamente.');
      console.error('Erro ao gerar relatório:', error);
    }
  };
  
  // Função para verificar permissões
  const canEdit = () => {
    if (!call || !user) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'manager' && ['draft'].includes(call.status)) return true;
    return false;
  };
  
  const canPublish = () => {
    if (!call || !user) return false;
    if (user.role === 'admin' || user.role === 'manager') {
      return call.status === 'draft';
    }
    return false;
  };
  
  const canCancel = () => {
    if (!call || !user) return false;
    if (user.role === 'admin' || user.role === 'manager') {
      return ['draft', 'open'].includes(call.status);
    }
    return false;
  };
  
  const canClose = () => {
    if (!call || !user) return false;
    if (user.role === 'admin' || user.role === 'manager') {
      return call.status === 'open';
    }
    return false;
  };
  
  const canRegisterCCEE = () => {
    if (!call || !user) return false;
    if (user.role === 'admin' || user.role === 'manager') {
      return call.status === 'closed' && !call.registeredInCCEE;
    }
    return false;
  };
  
  // Renderização condicional para carregamento
  if (loading && !call) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress />
      </Box>
    );
  }
  
  // Renderização se ocorrer um erro
  if (error && !call) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }
  
  if (!call) {
    return (
      <Alert severity="info">
        Chamada de energia não encontrada.
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
          Detalhes da Chamada
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {canEdit() && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/calls/${id}/edit`)}
            >
              Editar
            </Button>
          )}
          
          {canPublish() && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              onClick={handlePublish}
              disabled={loading}
            >
              Publicar
            </Button>
          )}
          
          {canCancel() && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => setCancelDialogOpen(true)}
              disabled={loading}
            >
              Cancelar
            </Button>
          )}
          
          {canClose() && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              onClick={() => setCloseDialogOpen(true)}
              disabled={loading}
            >
              Fechar Chamada
            </Button>
          )}
          
          {canRegisterCCEE() && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setRegisterDialogOpen(true)}
              disabled={loading}
            >
              Registrar na CCEE
            </Button>
          )}
          
          <Button
            variant="outlined"
            startIcon={<FileIcon />}
            onClick={handleGenerateReport}
          >
            Gerar Relatório
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Chip 
                label={getTypeLabel(call.type)} 
                color={call.type === 'buy' ? 'info' : 'secondary'}
              />
              <Chip 
                label={getStatusLabel(call.status)} 
                color={getStatusColor(call.status)}
              />
              {call.isExtraordinary && (
                <Chip label="Extraordinária" variant="outlined" />
              )}
              {call.registeredInCCEE && (
                <Chip label="Registrada na CCEE" color="success" />
              )}
            </Box>
            
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              {call.title}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} sx={{ p: 1, mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Tipo de Energia
            </Typography>
            <Typography variant="body1" gutterBottom>
              {getEnergyTypeLabel(call.energyType)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} sx={{ p: 1, mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Quantidade
            </Typography>
            <Typography variant="body1" gutterBottom>
              {call.amount} MWh
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} sx={{ p: 1, mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Prazo para Propostas
            </Typography>
            <Typography variant="body1" gutterBottom>
              {formatDateTime(call.deadline)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} sx={{ p: 1, mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Período de Suprimento
            </Typography>
            <Typography variant="body1" gutterBottom>
              {formatDate(call.startDate)} a {formatDate(call.endDate)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} sx={{ p: 1, mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Criado por
            </Typography>
            <Typography variant="body1" gutterBottom>
              {call.creator ? call.creator.name : 'N/A'} em {formatDateTime(call.createdAt)}
            </Typography>
          </Grid>
          
          {call.closedAt && (
            <Grid item xs={12} sm={6} md={4} sx={{ p: 1, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Fechado por
              </Typography>
              <Typography variant="body1" gutterBottom>
                {call.closer ? call.closer.name : 'N/A'} em {formatDateTime(call.closedAt)}
              </Typography>
            </Grid>
          )}
          
          {call.registrationDate && (
            <Grid item xs={12} sm={6} md={4} sx={{ p: 1, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Registro na CCEE
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatDateTime(call.registrationDate)}
              </Typography>
            </Grid>
          )}
          
          <Grid item xs={12}>
            <Divider sx={{ my: 3 }} />
          </Grid>
          
          <Grid item xs={12} sx={{ p: 1, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 1, fontWeight: 'bold' }}>
              Descrição
            </Typography>
            <Typography variant="body1" gutterBottom>
              {call.description || 'Sem descrição disponível.'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sx={{ p: 1 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 1, fontWeight: 'bold' }}>
              Requisitos
            </Typography>
            <Typography variant="body1" gutterBottom>
              {call.requirements || 'Sem requisitos específicos.'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Propostas" sx={{ fontWeight: 'bold' }} />
          <Tab label="Histórico de Ações" sx={{ fontWeight: 'bold' }} />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        <Paper>
          {call.Proposals && call.Proposals.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }}>
                    <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Contraparte</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Valor (R$)</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Quantidade (MWh)</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Data de Recebimento</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Status</TableCell>
                    {call.status === 'open' && (user.role === 'admin' || user.role === 'manager') && (
                      <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>Ações</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {call.Proposals.map((proposal) => (
                    <TableRow 
                      key={proposal.id}
                      sx={{ 
                        backgroundColor: proposal.id === call.winningProposalId ? 'rgba(46, 125, 50, 0.1)' : 'inherit',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                      }}
                    >
                      <TableCell sx={{ py: 2.5 }}>{proposal.Counterpart?.companyName}</TableCell>
                      <TableCell sx={{ py: 2.5 }}>{proposal.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                      <TableCell sx={{ py: 2.5 }}>{proposal.amount}</TableCell>
                      <TableCell sx={{ py: 2.5 }}>{formatDateTime(proposal.receivedAt)}</TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip 
                            label={getProposalStatusLabel(proposal.status)} 
                            color={getProposalStatusColor(proposal.status)}
                            size="small"
                          />
                          {proposal.id === call.winningProposalId && (
                            <Chip 
                              label="Vencedora" 
                              color="success" 
                              size="small" 
                            />
                          )}
                        </Box>
                      </TableCell>
                      {call.status === 'open' && (user.role === 'admin' || user.role === 'manager') && (
                        <TableCell align="right" sx={{ py: 2.5 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setSelectedProposal(proposal.id);
                              setCloseDialogOpen(true);
                            }}
                          >
                            Selecionar
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Nenhuma proposta recebida para esta chamada.
              </Typography>
            </Box>
          )}
        </Paper>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 2 }}>
          {/* Aqui poderia ser implementado um histórico de ações relacionadas à chamada */}
          <Typography variant="body1" color="text.secondary" align="center">
            Histórico de ações não disponível.
          </Typography>
        </Paper>
      </TabPanel>
      
      {/* Diálogo de cancelamento */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancelar Chamada de Energia</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Tem certeza que deseja cancelar esta chamada de energia? Esta ação não pode ser desfeita.
          </DialogContentText>
          <TextField
            autoFocus
            label="Motivo do cancelamento"
            fullWidth
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Voltar</Button>
          <Button 
            onClick={handleCancel} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Confirmar Cancelamento'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de fechamento */}
      <Dialog open={closeDialogOpen} onClose={() => setCloseDialogOpen(false)}>
        <DialogTitle>Fechar Chamada de Energia</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedProposal 
              ? 'Deseja confirmar o fechamento desta chamada com a proposta selecionada?' 
              : 'Deseja fechar esta chamada sem selecionar uma proposta vencedora?'}
          </DialogContentText>
          {selectedProposal && call.Proposals && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">
                Proposta selecionada:
              </Typography>
              {call.Proposals.filter(p => p.id === selectedProposal).map(proposal => (
                <Box key={proposal.id} sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Contraparte:</strong> {proposal.Counterpart?.companyName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Valor:</strong> {proposal.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Quantidade:</strong> {proposal.amount} MWh
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCloseDialogOpen(false)}>Cancelar</Button>
          <Button 
            onClick={handleClose} 
            color="primary" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Confirmar Fechamento'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de registro na CCEE */}
      <Dialog open={registerDialogOpen} onClose={() => setRegisterDialogOpen(false)}>
        <DialogTitle>Registrar na CCEE</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Informe os detalhes do registro na CCEE para esta chamada de energia.
          </DialogContentText>
          <TextField
            autoFocus
            label="Informações de registro"
            fullWidth
            multiline
            rows={3}
            value={registrationInfo}
            onChange={(e) => setRegistrationInfo(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRegisterDialogOpen(false)}>Cancelar</Button>
          <Button 
            onClick={handleRegisterCCEE} 
            color="primary" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Confirmar Registro'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CallDetail; 