import axios from 'axios';
import { HealthCheckResponse } from '@/types';

const rawEnvUrl = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL =
  rawEnvUrl && !rawEnvUrl.includes('.back4.app')
    ? rawEnvUrl
    : import.meta.env.PROD
      ? ''
      : 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const healthApi = {
  checkHealth: async (): Promise<HealthCheckResponse> => {
    const response = await apiClient.get<HealthCheckResponse>('/health');
    return response.data;
  },
};
