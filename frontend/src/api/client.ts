import axios from 'axios';
import api from './client';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
});

export default api;
