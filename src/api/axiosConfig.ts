import axios, { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';


export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: BACKEND_URL, 
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (!config.headers) config.headers = new AxiosHeaders();
    else if (!(config.headers instanceof AxiosHeaders)) config.headers = new AxiosHeaders(config.headers as any);
    if (token) (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
    if (!(config.headers as AxiosHeaders).has('Content-Type')) (config.headers as AxiosHeaders).set('Content-Type', 'application/json');
    return config;
});

export default api;
