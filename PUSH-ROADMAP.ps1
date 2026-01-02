# ===============================================
#   GIT PUSH - Para MikhaelGois/roadmap
# ===============================================

$REPO = "MikhaelGois/roadmap"

Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "  Enviando para: $REPO" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

# 1. Inicializar Git
Write-Host "[1/5] Inicializando Git..." -ForegroundColor Cyan
git init

# 2. Configurar user
Write-Host "[2/5] Configurando user.email e user.name..." -ForegroundColor Cyan
git config user.email "seu-email@example.com"
git config user.name "seu-nome"

# 3. Adicionar arquivos
Write-Host "[3/5] Adicionando arquivos..." -ForegroundColor Cyan
git add .

# 4. Fazer commit
Write-Host "[4/5] Fazendo commit..." -ForegroundColor Cyan
git commit -m "feat: projeto Entrega Roteirizada - deploy completo"

# 5. Conectar e enviar
Write-Host "[5/5] Conectando ao GitHub e fazendo push..." -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Yellow
Write-Host "   - Repository: $REPO" -ForegroundColor Yellow
Write-Host "   - Password: Use seu Personal Access Token" -ForegroundColor Yellow
Write-Host ""

# Remover remote antigo se existir
git remote remove origin 2>$null

# Adicionar novo remote
git remote add origin "https://github.com/$REPO.git"

# Renomear para main
git branch -M main

# Push
git push -u origin main

Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "  ✅ SUCESSO!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Verifique em: https://github.com/$REPO" -ForegroundColor Cyan
Write-Host ""
