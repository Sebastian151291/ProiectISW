import axios from 'axios';

const api = axios.create({
  baseURL: 'http://webrtcpi.ddns.net:8000', 
});

// Add a request interceptor
api.interceptors.request.use((config) => {
  // Get the token from local storage
  const token = localStorage.getItem('token');

  // If the token exists, add it to the Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  // Do something with request error
  return Promise.reject(error);
});

export default api;
