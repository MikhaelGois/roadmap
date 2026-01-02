#!/usr/bin/env bash
set -e

echo ""
echo "==============================================="
echo "  GIT PUSH - Entrega Roteirizada"
echo "==============================================="
echo ""

# Pedir o username do GitHub
read -p "Digite seu username do GitHub: " GITHUB_USER

# Validar input
if [ -z "$GITHUB_USER" ]; then
    echo "Erro: Username nao pode estar vazio!"
    exit 1
fi

echo ""
echo "Iniciando processo de push..."
echo ""

# Verificar se estamos no diretorio correto
if [ ! -d "backend" ]; then
    echo "Erro: Nao encontrei pasta 'backend'"
    echo "Execute este script na raiz do projeto!"
    exit 1
fi

# Inicializar Git
echo "[1/6] Inicializando Git..."
git init

# Adicionar arquivos
echo "[2/6] Adicionando arquivos..."
git add .

# Verificar se existem mudancas
if git diff --cached --quiet; then
    echo "Nenhuma mudanca para fazer commit"
else
    echo "[3/6] Fazendo primeiro commit..."
    git commit -m "feat: initial commit - projeto Entrega Roteirizada"
fi

# Adicionar remote
echo "[4/6] Conectando ao repositorio remoto..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/${GITHUB_USER}/entrega-roteirizada.git"

# Renomear branch para main
echo "[5/6] Configurando branch..."
git branch -M main

# Push
echo "[6/6] Fazendo push para GitHub..."
echo ""
echo "IMPORTANTE: Voce sera pedido para autenticar"
echo "- Username: $GITHUB_USER"
echo "- Password: Use Personal Access Token (nao sua senha!)"
echo ""
echo "Se nao tem um token, crie em:"
echo "https://github.com/settings/tokens"
echo ""

git push -u origin main

echo ""
echo "==============================================="
echo "  SUCESSO!"
echo "==============================================="
echo ""
echo "Seu projeto esta em:"
echo "https://github.com/${GITHUB_USER}/entrega-roteirizada"
echo ""
echo "Proximos passos:"
echo "1. Acesse o link acima para confirmar"
echo "2. Configure GitHub Pages (Settings > Pages > GitHub Actions)"
echo "3. Atualize links no README.md"
echo ""
