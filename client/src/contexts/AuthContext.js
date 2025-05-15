import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  
  // Função para verificar se o usuário está autenticado (ao carregar a página)
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          // Se o token for inválido ou expirado, limpar o localStorage
          localStorage.removeItem('token');
          api.defaults.headers.common['Authorization'] = '';
          setError('Sessão expirada. Por favor, faça login novamente.');
        }
      }
      
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);
  
  // Função de login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Salvar token no localStorage
      localStorage.setItem('token', response.data.token);
      
      // Configurar cabeçalho de autorização para futuras requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      return response.data;
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        'Erro ao realizar login. Verifique suas credenciais.';
      
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };
  
  // Função de registro
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        'Erro ao registrar usuário. Verifique os dados informados.';
      
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };
  
  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    api.defaults.headers.common['Authorization'] = '';
    setUser(null);
    setIsAuthenticated(false);
  };
  
  const clearError = () => {
    setError(null);
  };
  
  // Função getCurrentUser para verificar autenticação atual
  const getCurrentUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      const response = await api.get('/auth/me');
      console.log('Dados do usuário recebidos:', response.data);
      
      const userData = response.data.user;
      console.log('User data:', userData);
      console.log('Role do usuário:', userData?.role);
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    getCurrentUser
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 