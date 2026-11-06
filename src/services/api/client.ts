import axios from 'axios';
import { setupInterceptors } from './interceptors';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://leekuanyewchatbot-rdsqt5yv.back4.app';

const rawClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiClient = setupInterceptors(rawClient);
