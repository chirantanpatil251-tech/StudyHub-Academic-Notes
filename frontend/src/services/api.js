import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Request interceptor to add authorization header
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('studyhub_user');
    if (userInfo) {
      try {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error('Error parsing auth info from storage', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
