# Aplicativo Web de Gerenciamento de Atividades

Este projeto é um aplicativo web que permite aos usuários gerenciar atividades. Os usuários podem criar contas, fazer login, visualizar atividades e se inscrever/desinscrever delas. Os administradores têm a capacidade de criar, editar, excluir atividades e visualizar os inscritos em cada atividade.

## Funcionalidades

*   **Autenticação de Usuário:**
    *   Os usuários podem criar contas com nome de usuário, e-mail e senha.
    *   Os usuários podem fazer login com e-mail e senha.
*   **Gerenciamento de Atividades:**
    *   Os usuários podem visualizar uma lista de atividades disponíveis.
    *   Os usuários podem se inscrever ou cancelar a inscrição em atividades.
    *   As atividades possuem título, descrição, prazo, localização e número máximo de participantes.
*   **Privilégios de Administração:**
    *   Os administradores podem criar novas atividades.
    *   Os administradores podem editar atividades existentes.
    *   Os administradores podem excluir atividades.
    *   Os administradores podem visualizar a lista de inscritos em cada atividade.
*   **Validação de Dados:**
    *   O formato do e-mail é validado durante a criação do usuário.
    *   A força da senha é validada (pelo menos 8 caracteres, incluindo maiúsculas, minúsculas e números).
    *   Todos os campos são obrigatórios ao criar ou editar uma atividade.
    *   O número mínimo de participantes é 1.

## Tecnologias Utilizadas

*   **Frontend:** HTML, CSS (implicitamente), JavaScript
*   **Backend:** (Presumido - provavelmente Node.js com Express.js, baseado na estrutura de arquivos e rotas da API)
*   **Banco de Dados:** (Presumido - provável uso de um banco SQL ou NoSQL, como PostgreSQL ou MongoDB)

## Configuração e Instalação

Como o código do backend não está incluído, este é um guia genérico baseado no que é comum para esse tipo de projeto.

1.  **Clonar o Repositório:**
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```
2.  **Instalar Dependências (Backend - Presumido Node.js):**
    ```bash
    npm install
    ```
3.  **Configurar Banco de Dados:**
    *   Configure o banco de dados (PostgreSQL, MongoDB, etc.) e crie as tabelas/coleções necessárias.
    *   Defina os detalhes de conexão no arquivo de configuração do backend (e.g., `config.js` ou `.env`).
4.  **Iniciar o Servidor (Backend - Presumido Node.js):**
    ```bash
    npm start
    ```
5.  **Acessar a Aplicação:**
    *   Abra o navegador e acesse `http://localhost:<port>` (substitua `<port>` pela porta do servidor, provavelmente 3000).

## Endpoints da API

O frontend interage com os seguintes endpoints:

*   **`/api/users`** (POST): Criar um novo usuário.
    *   Corpo da Requisição:
        ```json
        {
            "username": "user123",
            "email": "user@example.com",
            "password": "Password123"
        }
        ```
*   **`/api/login`** (POST): Autenticar um usuário.
    *   Corpo da Requisição:
        ```json
        {
            "email": "user@example.com",
            "password": "Password123"
        }
        ```
    * **`/api/login`** (GET): Verificar se o usuário está logado.
*   **`/api/activities`** (GET): Obter todas as atividades.
*   **`/api/activities`** (POST): Criar uma nova atividade (apenas admin).
    *   Corpo da Requisição:
        ```json
        {
            "title": "Título da Atividade",
            "description": "Descrição da Atividade",
            "deadline": "2024-12-31",
            "location": "Local da Atividade",
            "maxParticipants": 10
        }
        ```
*   **`/api/activities/{activityId}`** (PUT): Atualizar uma atividade existente (apenas admin).
    *   Corpo da Requisição:
        ```json
        {
            "title": "Novo Título",
            "description": "Nova Descrição",
            "deadline": "2025-01-15",
            "location": "Nova Localização",
            "maxParticipants": 15
        }
        ```
*   **`/api/activities/{activityId}`** (DELETE): Excluir uma atividade (apenas admin).
*   **`/api/activities/{activityId}/subscribe`** (POST): Inscrever o usuário atual em uma atividade.
*   **`/api/activities/{activityId}/unsubscribe`** (POST): Cancelar a inscrição do usuário em uma atividade.
*   **`/api/activities/{activityId}/subscribers`** (GET): Obter a lista de inscritos em uma atividade (apenas admin).

## Páginas

*   **`/`**: Página de login.
*   **`/create`**: Página de criação de usuário.
*   **`/app`**: Página principal da aplicação (visualização e inscrição em atividades).
*   **`/createActivity`**: Página de criação e gerenciamento de atividades (apenas admin).