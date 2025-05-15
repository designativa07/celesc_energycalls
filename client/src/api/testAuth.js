import api from './api';

// Função para realizar login e obter um token
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password
    });
    
    // Armazenar o token no localStorage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    console.log('Login bem-sucedido!');
    console.log('Token:', response.data.token);
    
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer login:', error.response?.data?.message || error.message);
    throw error;
  }
};

// Função para verificar se o usuário atual está autenticado
export const checkAuth = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('Token atual:', token);
  console.log('Usuário atual:', user ? JSON.parse(user) : null);
  
  return {
    token,
    user: user ? JSON.parse(user) : null,
    isAuthenticated: !!token
  };
};

// Exportar funções para uso no console
window.testAuth = {
  login,
  checkAuth
};

// Para testar no console do navegador:
// await testAuth.login('admin@energycalls.com', 'admin123')
// testAuth.checkAuth() 