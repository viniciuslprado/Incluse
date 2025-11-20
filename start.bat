@echo off
echo Iniciando PCD - Plataforma de Inclusao...

echo.
echo 1. Verificando se o PostgreSQL esta rodando...
pg_isready -h localhost -p 5432 -U postgres
if %errorlevel% neq 0 (
    echo ERRO: PostgreSQL nao esta rodando na porta 5432
    echo Certifique-se de que o PostgreSQL esta instalado e rodando
    pause
    exit /b 1
)

echo.
echo 2. Instalando dependencias...
call npm run install-all

echo.
echo 3. Executando migracoes do Prisma...
cd pcd-backend
call npx prisma migrate dev --name init
call npx prisma generate
cd ..

echo.
echo 4. Iniciando o projeto...
call npm run dev

pause