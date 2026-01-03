

# PCD - Plataforma de Inclusão

Plataforma web para inclusão de pessoas com deficiência no mercado de trabalho, conectando candidatos e empresas de forma acessível e eficiente.

## Sobre o Projeto

Este repositório contém uma aplicação fullstack dividida em dois módulos principais:

- **Backend (`pcd-backend`)**: API REST desenvolvida em Node.js/TypeScript, responsável por autenticação, regras de negócio, integração com banco de dados PostgreSQL, envio de e-mails e gerenciamento de usuários, vagas, candidaturas e empresas.
- **Frontend (`pcd-frontend`)**: Interface web desenvolvida em React + Vite, acessível e responsiva, onde candidatos e empresas podem se cadastrar, gerenciar perfis, vagas e candidaturas.

---


## Como baixar o projeto

Clone este repositório em sua máquina:


```pnpm
pnpm git clone viniciuslprado/incluse incluse
cd incluse
```

---


### Instale o pnpm (caso não tenha):
```pnpm
npm install -g pnpm
```

### Instale todas as dependências do projeto (backend e frontend):
```pnpm
pnpm install
```

Ou, para instalar dependências separadamente:

```pnpm
cd pcd-backend && pnpm install
cd ../pcd-frontend && pnpm install
```

Se preferir, pode usar `npm install --workspaces`, mas pnpm é mais rápido e eficiente para monorepos.

---

## Sumário
- [Pré-requisitos](#pré-requisitos)
- [Configuração de variáveis de ambiente](#configuração-de-variáveis-de-ambiente)
- [Instalação e execução](#instalação-e-execução)
- [URLs](#urls)
- [Boas práticas de segurança](#boas-práticas-de-segurança)

---

## Pré-requisitos
- Node.js 18+
- npm 9+
- PostgreSQL rodando na porta 5432

---

## Configuração de variáveis de ambiente

### Backend (`pcd-backend`)
Crie um arquivo `.env` na pasta `pcd-backend` com o seguinte conteúdo (exemplo):

```
# Usuário administrador inicial (NÃO suba em produção)
ADMIN_EMAIL=seu@email.com
ADMIN_PASSWORD=sua_senha_segura
ADMIN_NAME=Seu Nome
PORT=3000
JWT_SECRET=sua_chave_secreta
APP_BASE_URL=http://localhost:5173
SMTP_HOST=smtp.seuprovedor.com
SMTP_PORT=587
SMTP_USER=usuario@provedor.com
SMTP_PASS=sua_senha_smtp
MAIL_FROM=Incluse <usuario@provedor.com>
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome-banco"
REFRESH_TOKEN_EXP_DAYS=30
RATE_LIMIT_PER_MINUTE=120
NODE_ENV=development
```

### Frontend (`pcd-frontend`)
Crie um arquivo `.env` na pasta `pcd-frontend` com o seguinte conteúdo (exemplo):

```
VITE_API_URL=http://localhost:3000
```

**Nunca suba arquivos `.env` para o repositório!**
Os arquivos `.env` já estão no `.gitignore`.
Use os arquivos `.env.example` como referência.

---

## Instalação e execução

### 1. Instalar dependências
```bash
npm install --workspaces
```

### 2. Configurar banco de dados
Certifique-se que o PostgreSQL está rodando na porta 5432 com:
- Usuário, senha e Database

### 3. Executar migrações do Prisma
```bash
cd pcd-backend
npx prisma migrate dev
npx prisma generate
```

### 4. Executar o projeto completo
```bash
npm run dev
```

Ou executar separadamente:
- Backend: `cd pcd-backend && npm run dev` (porta 3000)
- Frontend: `cd pcd-frontend && npm run dev` (porta 5173)

---

## URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

---


## Boas práticas de segurança
- Nunca suba arquivos `.env` ou dados sensíveis para o repositório.
- Use `.env.example` para documentar as variáveis necessárias.
- Altere as senhas e segredos padrão antes de rodar em produção.
- O backend depende de um banco PostgreSQL rodando.
- Para produção, ajuste as variáveis de ambiente conforme necessário.

---

## Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature ou correção: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m 'feat: minha contribuição'`
4. Push para o seu fork: `git push origin minha-feature`
5. Abra um Pull Request para este repositório

Mantenedores:
- [@viniciuslprado](https://github.com/viniciuslprado)
- [@gi-cardoso](https://github.com/gi-cardoso)