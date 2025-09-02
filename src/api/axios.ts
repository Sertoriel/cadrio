// src/api/axios.ts controle de endpoints
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://54.165.236.137/',
    //withCredentials: true, // Perguntar sobre cookies httponly na api(SANCTUM)
    headers: { 'Content-Type': 'application/json' },
    timeout: 1500,
});

api.interceptors.response.use(
    res => res,
    err => {
        // tratamento global de erros (ex. : refresh token ou captura de 401)
        if (err.response) {
            console.log('Resposta de erro da API:', err.response.data);
            return Promise.reject(err.response.data);
        }else{
            console.error('Erro na requisição:', err);
            return Promise.reject({ message: 'Erro na requisição. Tente novamente.' });
        }
    }
);

export default api;
