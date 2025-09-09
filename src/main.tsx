// src/main.tsx (ou onde você configura o QueryClient)
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';

// Função para verificar se a resposta é bem-sucedida
const isSuccessfulResponse = (response: any) => {
  return response.status >= 200 && response.status < 300;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
      retry: 1,
      // Adicionar queryFn personalizada para tratar erros HTTP
      queryFn: async ({ queryKey }) => {
        const response = await fetch(`http://54.165.236.137/${queryKey[0]}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!isSuccessfulResponse(response)) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro na requisição');
        }

        return response.json();
      },
    },
    mutations: {
      // Configurações similares para mutações
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);