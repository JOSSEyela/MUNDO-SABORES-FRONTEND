import axios from 'axios';

// Puedes usar import.meta.env.VITE_BACKEND_URL si tienes variables de entorno configuradas con Vite
const BACKEND_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: BACKEND_URL,
});

// Interceptor para agregar token automáticamente a cada solicitud
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
export { BACKEND_URL };
