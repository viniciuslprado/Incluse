@echo off
echo ========================================
echo    INICIANDO SERVIDOR BACKEND - PCD
echo ========================================

cd /d "C:\1FACULDADE\4°Semetre\Parad. da Prog II\PCD\pcd-backend"

echo Verificando se estamos no diretorio correto...
if not exist "src\server.ts" (
    echo ERRO: Arquivo server.ts nao encontrado!
    echo Verifique se o caminho esta correto.
    pause
    exit /b 1
)

echo Iniciando servidor backend...
echo Acesse: http://localhost:3000
echo Para parar o servidor: Ctrl+C
echo ========================================

npx tsx watch src/server.ts

pause