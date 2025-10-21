@echo off
echo ========================================
echo    INICIANDO SERVIDOR FRONTEND - PCD
echo ========================================

cd /d "C:\1FACULDADE\4°Semetre\Parad. da Prog II\PCD\pcd-frontend"

echo Verificando se estamos no diretorio correto...
if not exist "src\App.tsx" (
    echo ERRO: Arquivo App.tsx nao encontrado!
    echo Verifique se o caminho esta correto.
    pause
    exit /b 1
)

echo Iniciando servidor frontend...
echo Acesse: http://localhost:5173 ou http://localhost:5174
echo Para parar o servidor: Ctrl+C
echo ========================================

npx vite

pause