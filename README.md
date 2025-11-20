# PCD - Plataforma de Inclusão

## Como executar o projeto

### 1. Instalar dependências
```bash
npm run install-all
```

### 2. Configurar banco de dados
Certifique-se que o PostgreSQL está rodando na porta 5432 com:
- Usuário: postgres
- Senha: 123
- Database: pcd-banco

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
- Backend: `npm run backend` (porta 3000)
- Frontend: `npm run frontend` (porta 5173)

## URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000