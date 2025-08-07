# CADRio - Sistema de Agendamento

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Aplicação web para agendamento no Cadastro Único (CADRio) do município do Rio de Janeiro, com formulário em etapas, validações em tempo real e interface responsiva.

## ✨ Funcionalidades

- **Formulário em Etapas**  
  Processo de agendamento dividido em seções lógicas (Dados Pessoais, Agendamento, Confirmação)

- **Validação Inteligente**  
  Verificação em tempo real de CPF, telefone e outros campos com feedback visual

- **Formatação Automática**  
  Máscaras para CPF e telefone durante a digitação

- **Seleção de Unidades**  
  Busca de unidades por bairro com exibição de endereço

- **Agendamento Intuitivo**  
  Interface amigável para seleção de data e horário disponíveis

- **Resumo do Agendamento**  
  Confirmação com todos os dados preenchidos antes do envio

- **Design Responsivo**  
  Experiência otimizada para mobile e desktop

## 🛠 Tecnologias

- **Frontend:**  
  React + TypeScript  
  Vite (Build Tool)  
  Tailwind CSS (Estilização)  
  Lucide React (Ícones)

## 📂 Estrutura do Projeto

```
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.*
├── vite.config.ts
└── src/
    ├── assets/
    ├── components/
    │   ├── CampoInput.tsx
    │   ├── CampoSelect.tsx
    │   ├── Footer.tsx
    │   ├── FormularioAgendamento.tsx
    │   ├── FormularioEtapas.tsx
    │   └── Header.tsx
    ├── App.tsx
    ├── index.css
    └── main.tsx
```

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/cadrio-agendamento.git
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Para build de produção:
```bash
npm run build
```

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/sua-feature`)
3. Commit suas alterações (`git commit -m 'feat: Minha nova feature'`)
4. Push para a branch (`git push origin feature/sua-feature`)
5. Abra um Pull Request
