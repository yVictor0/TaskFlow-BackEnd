# 🚀 TaskFlow - Backend

API RESTful desenvolvida para gerenciar as rotas e regras de negócio da aplicação **TaskFlow**, contando com autenticação segura via JWT, controle de acesso por CORS e suporte a deploy simplificado.

---

## 🛠️ Tecnologias Utilizadas

* **Node.js** — Ambiente de execução JavaScript server-side
* **Express** — Framework para construção de rotas e rotinas da API
* **JSON Web Token (JWT)** — Autenticação e proteção de rotas privadas
* **CORS** — Middleware para controle de acesso às origens da API
* **Vercel** — Serverless Deployment (configurado via `vercel.json` e pasta `api/`)

---

## 📂 Estrutura do Projeto

```text
├── api/             # Configuração/Entrypoint para execução na Vercel
├── src/             # Código-fonte principal da aplicação (rotas, controllers, middlewares)
├── .env             # Variáveis de ambiente (não commitado)
├── .gitignore       # Arquivos/pastas ignorados pelo Git
├── package.json     # Dependências e scripts da aplicação
├── server.js        # Arquivo principal de inicialização do servidor local
└── vercel.json      # Configuração de rotas para deploy Serverless na Vercel
