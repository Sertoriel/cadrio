CADRio - Sistema de Agendamento

Descrição do Projeto

Este projeto é uma aplicação web desenvolvida em React com TypeScript, utilizando Vite como ferramenta de build e Tailwind CSS para estilização. O objetivo principal é fornecer um formulário de agendamento intuitivo e em etapas para o Cadastro Único (CADRio) do município do Rio de Janeiro. A aplicação coleta dados pessoais do usuário e permite o agendamento de atendimentos em unidades específicas, com validações em tempo real e uma interface responsiva e moderna.

Funcionalidades

•
Formulário de Agendamento em Etapas: Guia o usuário por um processo de agendamento dividido em seções lógicas (Dados Pessoais, Agendamento, Confirmação).

•
Validação de Dados em Tempo Real: Inclui validações para CPF, nome, telefone e outros campos, com feedback visual imediato.

•
Formatação Automática de Campos: Formata CPF e números de telefone conforme o usuário digita.

•
Seleção de Unidades por Bairro: Permite ao usuário selecionar uma unidade de atendimento com base no bairro de moradia, exibindo o endereço da unidade.

•
Seleção de Data e Horário: Interface amigável para escolha de datas e horários disponíveis para agendamento.

•
Resumo do Agendamento: Exibe um resumo completo dos dados preenchidos antes da confirmação final.

•
Design Responsivo: A interface se adapta a diferentes tamanhos de tela, proporcionando uma boa experiência em dispositivos móveis e desktops.

•
Estilização Moderna: Utiliza Tailwind CSS para um design limpo, moderno e com animações sutis.

Tecnologias Utilizadas

•
React: Biblioteca JavaScript para construção de interfaces de usuário.

•
TypeScript: Linguagem de programação que adiciona tipagem estática ao JavaScript, melhorando a robustez e manutenibilidade do código.

•
Vite: Ferramenta de build de nova geração para desenvolvimento web, oferecendo um ambiente de desenvolvimento rápido.

•
Tailwind CSS: Framework CSS utility-first para estilização rápida e eficiente.

•
Lucide React: Biblioteca de ícones leves e personalizáveis.

Estrutura do Projeto

Plain Text


.gitignore
eslint.config.js
index.html
package.json
package-lock.json
postcss.config.js
tailwind.config.js
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
vite-env.d.ts

src/
├── assets/
│   └── react.svg
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


Instalação e Configuração

Para configurar e executar o projeto localmente, siga os passos abaixo:

1.
Clone o repositório:

2.
Instale as dependências:

3.
Execute o servidor de desenvolvimento:

4.
Build para Produção:

Uso

Após iniciar a aplicação, o usuário será direcionado para o formulário de agendamento. Basta seguir as etapas, preenchendo os dados solicitados e selecionando as opções de agendamento. O formulário guiará o usuário automaticamente para a próxima etapa após a validação bem-sucedida de cada campo.

Contribuição

Contribuições são bem-vindas! Se você deseja contribuir com este projeto, por favor, siga estas diretrizes:

1.
Faça um fork do repositório.

2.
Crie uma nova branch para sua feature (git checkout -b feature/sua-feature).

3.
Faça suas alterações e commit-as (git commit -m 'feat: Adiciona nova feature').

4.
Envie suas alterações para o repositório remoto (git push origin feature/sua-feature).

5.
Abra um Pull Request.

Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.




Desenvolvido por Manus AI

