import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  InputAdornment,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Block as BlockIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/api';

const UsersList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Estado para confirmação de ativação/desativação
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    userId: null,
    newStatus: null
  });
  
  // Carregar usuários quando o componente montar ou filtros mudarem
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Construir query params para filtros
        let queryParams = '';
        if (roleFilter) queryParams += `role=${roleFilter}&`;
        if (statusFilter !== '') queryParams += `active=${statusFilter}&`;
        
        const response = await api.get(`/users${queryParams ? `?${queryParams}` : ''}`);
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        setError('Falha ao carregar usuários. Verifique se você tem permissões de administrador.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [roleFilter, statusFilter]);
  
  // Filtrar usuários com base na pesquisa
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredUsers(users);
    } else {
      const searchTerm = search.toLowerCase();
      const filtered = users.filter(
        user => 
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          (user.department && user.department.toLowerCase().includes(searchTerm))
      );
      setFilteredUsers(filtered);
    }
  }, [search, users]);
  
  // Manipular mudança na pesquisa
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  
  // Abrir diálogo de confirmação para ativar/desativar usuário
  const handleToggleUserStatus = (userId, userName, currentStatus) => {
    const newStatus = !currentStatus;
    
    setConfirmDialog({
      open: true,
      title: newStatus ? 'Ativar Usuário' : 'Desativar Usuário',
      message: `Tem certeza que deseja ${newStatus ? 'ativar' : 'desativar'} o usuário "${userName}"?`,
      userId,
      newStatus
    });
  };
  
  // Confirmar ativação/desativação do usuário
  const confirmToggleStatus = async () => {
    try {
      await api.patch(`/users/${confirmDialog.userId}/toggle-status`, {
        active: confirmDialog.newStatus
      });
      
      // Atualizar o estado localmente
      setUsers(users.map(u => 
        u.id === confirmDialog.userId 
          ? { ...u, active: confirmDialog.newStatus } 
          : u
      ));
      
      setConfirmDialog({ ...confirmDialog, open: false });
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
      setError('Falha ao alterar status do usuário.');
    }
  };
  
  // Função para renderizar chips de cargo
  const renderRoleChip = (role) => {
    let color = 'default';
    let label = 'Usuário';
    
    if (role === 'admin') {
      color = 'error';
      label = 'Administrador';
    } else if (role === 'manager') {
      color = 'primary';
      label = 'Gerente';
    }
    
    return <Chip size="small" color={color} label={label} />;
  };
  
  // Renderização condicional para carregamento
  if (loading && users.length === 0) {
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
          Usuários
        </Typography>
        {user.role === 'admin' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/register')}
            sx={{ mt: { xs: 0, sm: 1 }, mb: { xs: 0, sm: 1 }, position: 'relative', zIndex: 1 }}
          >
            Novo Usuário
          </Button>
        )}
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Buscar usuários..."
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
            <FormControl fullWidth>
              <InputLabel>Cargo</InputLabel>
              <Select
                value={roleFilter}
                label="Cargo"
                onChange={e => setRoleFilter(e.target.value)}
                size="small"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="manager">Gerente</MenuItem>
                <MenuItem value="user">Usuário</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={e => setStatusFilter(e.target.value)}
                size="small"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="true">Ativo</MenuItem>
                <MenuItem value="false">Inativo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Departamento</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.department || '-'}</TableCell>
                  <TableCell>{renderRoleChip(user.role)}</TableCell>
                  <TableCell>
                    <Chip 
                      size="small"
                      color={user.active ? 'success' : 'default'}
                      label={user.active ? 'Ativo' : 'Inativo'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {/* Ícone para editar usuário */}
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => navigate(`/users/edit/${user.id}`)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    
                    {/* Ícone para ativar/desativar usuário */}
                    <IconButton
                      size="small"
                      color={user.active ? 'error' : 'success'}
                      onClick={() => handleToggleUserStatus(user.id, user.name, user.active)}
                    >
                      {user.active ? (
                        <BlockIcon fontSize="small" />
                      ) : (
                        <CheckIcon fontSize="small" />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Diálogo de confirmação para ativação/desativação */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
            Cancelar
          </Button>
          <Button 
            onClick={confirmToggleStatus} 
            variant="contained" 
            color={confirmDialog.newStatus ? 'success' : 'error'}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersList; 