// src/api/axios.ts controle de endpoints
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://54.165.236.137/',
    withCredentials: true, // Perguntar sobre cookies httponly na api(SANCTUM)
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
});

api.interceptors.response.use(
    res => res,
    err => {
        // tratamento global de erros (ex. : refresh token ou captura de 401)
        console.error('Erro na requisição:', err);
        return Promise.reject(err);
    }
);

export default api;
