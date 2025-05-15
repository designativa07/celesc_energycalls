import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Info as InfoIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import api from '../../api/api';

const MyProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  // Buscar propostas da contraparte
  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await api.get('/counterpart-portal/my-proposals');
        setProposals(response.data);
      } catch (error) {
        console.error('Erro ao buscar propostas:', error);
        setError(
          error.response?.data?.message || 
          'Erro ao carregar propostas. Por favor, tente novamente.'
        );
      } finally {
        setLoading(false);
      }
    };
    
    fetchProposals();
  }, []);
  
  // Função para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };
  
  // Formatar preço
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  };
  
  // Chip de status da proposta
  const renderStatusChip = (status) => {
    let color, icon, label;
    
    switch (status) {
      case 'accepted':
        color = 'success';
        icon = <CheckIcon />;
        label = 'Aceita';
        break;
      case 'rejected':
        color = 'error';
        icon = <CloseIcon />;
        label = 'Rejeitada';
        break;
      case 'expired':
        color = 'default';
        icon = <TimeIcon />;
        label = 'Expirada';
        break;
      default:
        color = 'warning';
        icon = <TimeIcon />;
        label = 'Pendente';
    }
    
    return (
      <Chip 
        icon={icon} 
        label={label} 
        color={color} 
        size="small" 
        variant="outlined"
      />
    );
  };
  
  // Navegar para detalhes da chamada
  const handleViewCall = (callId) => {
    navigate(`/counterpart-portal/calls/${callId}`);
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
        Minhas Propostas
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {proposals.length > 0 ? (
        <Paper elevation={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Chamada</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right">Preço</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell align="center">Data de Envio</TableCell>
                  <TableCell align="center">Válida até</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {proposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell component="th" scope="row">
                      {proposal.EnergyCall.title}
                    </TableCell>
                    <TableCell align="center">
                      {renderStatusChip(proposal.status)}
                    </TableCell>
                    <TableCell align="right">
                      {formatPrice(proposal.price)}
                    </TableCell>
                    <TableCell align="right">
                      {proposal.amount} MWh
                    </TableCell>
                    <TableCell align="center">
                      {formatDate(proposal.receivedAt)}
                    </TableCell>
                    <TableCell align="center">
                      {formatDate(proposal.validUntil)}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver chamada">
                        <IconButton
                          size="small"
                          onClick={() => handleViewCall(proposal.EnergyCall.id)}
                        >
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Você ainda não enviou nenhuma proposta.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/counterpart-portal/calls')}
            sx={{ mt: 2 }}
          >
            Ver Chamadas Disponíveis
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default MyProposals; 