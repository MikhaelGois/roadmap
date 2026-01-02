@echo off
setlocal enabledelayedexpansion

echo.
echo ===============================================
echo   GIT PUSH - Entrega Roteirizada
echo ===============================================
echo.

REM Pedir o username do GitHub
set /p GITHUB_USER="Digite seu username do GitHub: "

REM Validar input
if "!GITHUB_USER!"=="" (
    echo Erro: Username nao pode estar vazio!
    pause
    exit /b 1
)

echo.
echo Iniciando processo de push...
echo.

REM Verificar se estamos no diretorio correto
if not exist "backend" (
    echo Erro: Nao encontrei pasta 'backend'
    echo Execute este script na raiz do projeto!
    pause
    exit /b 1
)

REM Inicializar Git
echo [1/6] Inicializando Git...
git init
if errorlevel 1 (
    echo Erro ao inicializar Git
    pause
    exit /b 1
)

REM Adicionar arquivos
echo [2/6] Adicionando arquivos...
git add .
if errorlevel 1 (
    echo Erro ao adicionar arquivos
    pause
    exit /b 1
)

REM Verificar se existem mudancas
git diff --cached --quiet
if errorlevel 1 (
    echo [3/6] Fazendo primeiro commit...
    git commit -m "feat: initial commit - projeto Entrega Roteirizada"
) else (
    echo Nenhuma mudanca para fazer commit
)

REM Adicionar remote
echo [4/6] Conectando ao repositorio remoto...
git remote remove origin 2>nul
git remote add origin https://github.com/!GITHUB_USER!/entrega-roteirizada.git
if errorlevel 1 (
    echo Erro ao adicionar remote
    pause
    exit /b 1
)

REM Renomear branch para main
echo [5/6] Configurando branch...
git branch -M main
if errorlevel 1 (
    echo Erro ao renomear branch
    pause
    exit /b 1
)

REM Push
echo [6/6] Fazendo push para GitHub...
echo.
echo IMPORTANTE: Voce sera pedido para autenticar
echo - Username: !GITHUB_USER!
echo - Password: Use Personal Access Token (nao sua senha!)
echo.
echo Se nao tem um token, crie em:
echo https://github.com/settings/tokens
echo.
pause

git push -u origin main
if errorlevel 1 (
    echo.
    echo Erro ao fazer push!
    echo Verifique sua conexao e credenciais
    pause
    exit /b 1
)

echo.
echo ===============================================
echo   SUCESSO!
echo ===============================================
echo.
echo Seu projeto esta em:
echo https://github.com/!GITHUB_USER!/entrega-roteirizada
echo.
echo Proximos passos:
echo 1. Acesse o link acima para confirmar
echo 2. Configure GitHub Pages (Settings ^> Pages ^> GitHub Actions)
echo 3. Atualize links no README.md
echo.
pause
