/**
 * API configuration v1.0.1
 * Updated for VPS deployment
 */
import axios from 'axios';

// Determine the API base URL based on the current environment
const getBaseURL = () => {
  // In production, use the same domain as the client
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  // In development, use localhost with the correct port
  return 'http://localhost:5000/api';
};

const baseURL = getBaseURL();

// Log the environment and API URL for debugging
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`API base URL: ${baseURL}`);

const api = axios.create({
  baseURL
});

// Interceptor para incluir o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests for debugging
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para lidar com erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log the full error for debugging
    console.error('API Response Error:', error);
    
    // Se o erro for 401 (não autorizado), pode ser token expirado
    if (error.response && error.response.status === 401) {
      // Opcionalmente, podemos deslogar o usuário aqui
      localStorage.removeItem('token');
      // window.location.href = '/login'; // Redirect to login if needed
    }
    
    return Promise.reject(error);
  }
);

export default api; 