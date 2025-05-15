import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/api';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    department: '',
    role: ''
  });
  
  // Se o usuário logado não for admin, redirecionar
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  // Carregar dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.get(`/users/${id}`);
        setUserData({
          name: response.data.name,
          email: response.data.email,
          department: response.data.department || '',
          role: response.data.role
        });
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        setError('Não foi possível carregar os dados do usuário.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchUserData();
    }
  }, [id]);
  
  // Manipular mudanças no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Enviar atualização
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      await api.put(`/users/${id}`, userData);
      setSuccess('Usuário atualizado com sucesso!');
      
      // Redirecionar após um delay
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      setError(error.response?.data?.message || 'Falha ao atualizar usuário.');
    }
  };
  
  if (loading) {
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
          Editar Usuário
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/users')}
        >
          Voltar
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome"
                name="name"
                value={userData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={userData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Departamento/Área"
                name="department"
                value={userData.department}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Cargo</InputLabel>
                <Select
                  name="role"
                  value={userData.role}
                  label="Cargo"
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="user">Usuário</MenuItem>
                  <MenuItem value="manager">Gerente</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  variant="outlined"
                  sx={{ mr: 2 }}
                  onClick={() => navigate('/users')}
                >
                  Cancelar
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                >
                  Salvar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default UserEdit; 