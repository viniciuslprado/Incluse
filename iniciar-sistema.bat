@echo off
title Sistema PCD - Inicializacao
color 0A

echo =========================================================
echo               SISTEMA DE VAGAS PCD
echo    Sistema de Gestao de Vagas para Pessoas com Deficiencia
echo =========================================================
echo.
echo Escolha uma opcao:
echo.
echo [1] Iniciar BACKEND (API - Porta 3000)
echo [2] Iniciar FRONTEND (Interface - Porta 5173/5174)  
echo [3] Iniciar AMBOS (Backend + Frontend)
echo [4] Executar SEED (Popular banco de dados)
echo [5] Verificar STATUS dos servidores
echo [0] Sair
echo.
echo =========================================================

set /p choice="Digite sua opcao (0-5): "

if "%choice%"=="1" goto backend
if "%choice%"=="2" goto frontend  
if "%choice%"=="3" goto both
if "%choice%"=="4" goto seed
if "%choice%"=="5" goto status
if "%choice%"=="0" goto exit
goto invalid

:backend
echo Iniciando apenas o BACKEND...
start "Backend PCD" cmd /c "start-backend.bat"
goto menu

:frontend
echo Iniciando apenas o FRONTEND...
start "Frontend PCD" cmd /c "start-frontend.bat"
goto menu

:both
echo Iniciando BACKEND e FRONTEND...
start "Backend PCD" cmd /c "start-backend.bat"
timeout /t 3 /nobreak > nul
start "Frontend PCD" cmd /c "start-frontend.bat"
goto menu

:seed
echo Executando SEED do banco de dados...
cd /d "C:\1FACULDADE\4°Semetre\Parad. da Prog II\PCD\pcd-backend"
npm run seed
pause
goto menu

:status
echo Verificando status dos servidores...
echo.
echo Testando Backend (porta 3000):
curl -s http://localhost:3000/empresas >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Backend esta rodando
) else (
    echo [ERRO] Backend nao esta rodando
)
echo.
echo Testando Frontend (porta 5173):
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Frontend esta rodando na porta 5173
) else (
    echo Testando Frontend (porta 5174):
    curl -s http://localhost:5174 >nul 2>&1
    if %errorlevel%==0 (
        echo [OK] Frontend esta rodando na porta 5174
    ) else (
        echo [ERRO] Frontend nao esta rodando
    )
)
echo.
pause
goto menu

:invalid
echo Opcao invalida! Tente novamente.
timeout /t 2 /nobreak > nul
goto menu

:menu
cls
goto start

:exit
echo Saindo...
exit /b 0

:start
goto menu