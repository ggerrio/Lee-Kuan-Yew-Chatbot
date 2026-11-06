import axios from 'axios';
import { setupInterceptors } from './interceptors';

const rawEnvUrl = import.meta.env.VITE_API_BASE_URL;
const BASE_URL =
  rawEnvUrl && !rawEnvUrl.includes('.back4.app')
    ? rawEnvUrl
    : import.meta.env.PROD
      ? ''
      : 'http://localhost:8000';

const rawClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiClient = setupInterceptors(rawClient);
