# ===============================================
#   GIT PUSH - Entrega Roteirizada
# ===============================================

$GITHUB_USER = "mikhaelgois"

Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "  Enviando para GitHub: $GITHUB_USER" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

# 1. Inicializar Git
Write-Host "[1/5] Inicializando Git..." -ForegroundColor Cyan
git init

# 2. Configurar user (se não estiver configurado)
Write-Host "[2/5] Configurando user.email e user.name..." -ForegroundColor Cyan
git config user.email "seu-email@example.com"
git config user.name "seu-nome"

# 3. Adicionar arquivos
Write-Host "[3/5] Adicionando arquivos..." -ForegroundColor Cyan
git add .

# 4. Fazer commit
Write-Host "[4/5] Fazendo commit..." -ForegroundColor Cyan
git commit -m "feat: initial commit - projeto Entrega Roteirizada"

# 5. Conectar e enviar
Write-Host "[5/5] Conectando ao GitHub e fazendo push..." -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Yellow
Write-Host "   - Username: $GITHUB_USER" -ForegroundColor Yellow
Write-Host "   - Password: Use seu Personal Access Token" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Se não tem token, acesse:" -ForegroundColor Yellow
Write-Host "   https://github.com/settings/tokens" -ForegroundColor Yellow
Write-Host ""

# Remover remote antigo se existir
git remote remove origin 2>$null

# Adicionar novo remote
git remote add origin "https://github.com/$GITHUB_USER/entrega-roteirizada.git"

# Renomear para main
git branch -M main

# Push
git push -u origin main

Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "  ✅ SUCESSO!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Seu projeto está em:" -ForegroundColor Cyan
Write-Host "https://github.com/$GITHUB_USER/entrega-roteirizada" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "1. ✅ Acesse o link acima para confirmar" -ForegroundColor Cyan
Write-Host "2. 📄 Configure GitHub Pages (Settings > Pages > GitHub Actions)" -ForegroundColor Cyan
Write-Host "3. 🔗 Atualize links no README.md com seu username" -ForegroundColor Cyan
Write-Host ""
