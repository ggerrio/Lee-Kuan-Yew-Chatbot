import axios from 'axios';
import { HealthCheckResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://leekuanyewchatbot-rdsqt5yv.back4.app';

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
