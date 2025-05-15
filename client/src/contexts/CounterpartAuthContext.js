import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/api';

const CounterpartAuthContext = createContext();

export const useCounterpartAuth = () => useContext(CounterpartAuthContext);

export const CounterpartAuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [counterpart, setCounterpart] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  
  // Função para verificar se a contraparte está autenticada (ao carregar a página)
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('counterpart_token');
      
      if (token) {
        try {
          // Configurar cabeçalho de autorização
          api.defaults.headers.common['Counterpart-Authorization'] = `Bearer ${token}`;
          
          const response = await api.get('/counterpart-auth/me');
          setCounterpart(response.data.counterpart);
          setIsAuthenticated(true);
        } catch (error) {
          // Se o token for inválido ou expirado, limpar o localStorage
          localStorage.removeItem('counterpart_token');
          delete api.defaults.headers.common['Counterpart-Authorization'];
          setError('Sessão expirada. Por favor, faça login novamente.');
        }
      }
      
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);
  
  // Função de login
  const login = async (cnpj, accessCode) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/counterpart-auth/login', { cnpj, accessCode });
      
      // Salvar token no localStorage
      localStorage.setItem('counterpart_token', response.data.token);
      
      // Configurar cabeçalho de autorização para futuras requisições
      api.defaults.headers.common['Counterpart-Authorization'] = `Bearer ${response.data.token}`;
      
      setCounterpart(response.data.counterpart);
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
  
  // Função de logout
  const logout = () => {
    localStorage.removeItem('counterpart_token');
    delete api.defaults.headers.common['Counterpart-Authorization'];
    setCounterpart(null);
    setIsAuthenticated(false);
  };
  
  const clearError = () => {
    setError(null);
  };
  
  const value = {
    counterpart,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    clearError
  };
  
  return <CounterpartAuthContext.Provider value={value}>{children}</CounterpartAuthContext.Provider>;
}; 