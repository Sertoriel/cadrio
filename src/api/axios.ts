import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://54.165.236.137/',
    headers: { 'Content-Type': 'application/json' },
    timeout: 1500,
    validateStatus: function (status) {
        // Considera como sucesso apenas os status codes 2xx
        console.log('Status da resposta:', status);

        return status >= 200 && status < 300;
    }
});

api.interceptors.response.use(
    res => res,
    err => {
        if (err.response) {
            console.log('Resposta de erro da API:', err.response.data);
            return Promise.reject(err.response.data);
        } else {
            console.error('Erro na requisição:', err);
            return Promise.reject({ message: 'Erro na requisição. Tente novamente.' });
        }
    }
);

export default api;