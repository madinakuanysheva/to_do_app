import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append('grant_type', 'password');
  formData.append('username', username);
  formData.append('password', password);

  const response = await api.post('/auth/token', formData.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

export const register = async (email: string, username: string, password: string) => {
  const response = await api.post('/auth/register', {
    email,
    username,
    password,
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/me');
  return response.data;
};

export const getTodos = async () => {
  const response = await api.get('/api/get_tasks');
  return response.data;
};

export const createTodo = async (title: string, description?: string) => {
  const response = await api.post('/api/create_task', {
    title,
    description,
  });
  return response.data;
};

export const updateTodo = async (id: number, title: string, description?: string) => {
  const response = await api.put(`/api/tasks/${id}`, {
    title,
    description,
  });
  return response.data;
};

export const deleteTodo = async (id: number) => {
  await api.delete(`/api/tasks/${id}`);
}; 