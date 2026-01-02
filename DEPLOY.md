# 🚀 Guia de Deploy — Entrega Roteirizada

Este guia oferece **3 opções de deploy** para o projeto "Entrega Roteirizada":

1. **Deploy Rápido (Demo Estático)** — GitHub Pages (sem backend real, apenas protótipo)
2. **Deploy Produção Simples** — Vercel (Frontend) + Render (Backend) — Grátis/Baixo Custo
3. **Deploy Produção Completo** — AWS/Azure com Docker + Kubernetes

---

## 📋 Índice

- [Opção 1: Demo Estático (GitHub Pages)](#opção-1-demo-estático-github-pages)
- [Opção 2: Produção Simples (Vercel + Render)](#opção-2-produção-simples-vercel--render)
- [Opção 3: Produção Completa (AWS/Azure)](#opção-3-produção-completa-awsazure)
- [Desenvolvimento Local](#desenvolvimento-local)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Troubleshooting](#troubleshooting)

---

## Opção 1: Demo Estático (GitHub Pages)

**Ideal para:** Protótipo, demonstração para clientes, testes sem backend

### ✅ Vantagens:
- ✅ **100% Gratuito**
- ✅ Deploy automático ao fazer push
- ✅ Sem necessidade de secrets ou configuração de servidores
- ✅ Funciona offline (PWA com mock)

### ⚠️ Limitações:
- ⚠️ API simulada (localStorage, sem banco de dados real)
- ⚠️ WebSocket simulado (sem real-time entre usuários)
- ⚠️ Sem upload de fotos/arquivos

### 🔧 Como Fazer Deploy:

#### Passo 1: Configurar GitHub Pages
1. Vá para **Settings** → **Pages** do seu repositório
2. Em **Source**, selecione **GitHub Actions**

#### Passo 2: Fazer Deploy (Opção A - Scripts Automáticos)

**Windows PowerShell:**
```powershell
.\scripts\publish-demo.ps1 -Message "Deploy inicial"
```

**macOS/Linux/WSL:**
```bash
./scripts/publish-demo.sh "Deploy inicial"
```

#### Passo 2: Fazer Deploy (Opção B - Manual)
```bash
git add -A
git commit -m "chore: deploy demo to gh-pages"
git push origin main
```

#### Passo 3: Acessar o Deploy
Após alguns minutos, acesse:
```
https://<seu-usuario>.github.io/entrega-roteirizada/
```

### 🎨 Customizar o Mock (Dados Fictícios)
Edite [`frontend/panel/src/lib/mockServer.ts`](frontend/panel/src/lib/mockServer.ts) para alterar:
- Motoristas padrão
- Entregas fictícias
- Rotas simuladas

---

## Opção 2: Produção Simples (Vercel + Render)

**Ideal para:** MVP, pequenas empresas, até ~10.000 entregas/mês

### ✅ Vantagens:
- ✅ **Custo baixo** (planos gratuitos disponíveis)
- ✅ Deploy automático via GitHub
- ✅ Backend real com PostgreSQL
- ✅ SSL automático
- ✅ Escalável para pequeno/médio porte

### 💰 Custos Estimados:
- **Vercel (Frontend):** Gratuito até 100GB bandwidth
- **Render (Backend + DB):** $7/mês (starter) ou gratuito com limitações
- **Total:** ~$7-15/mês

### 🔧 Pré-requisitos:

#### 1. Criar Conta Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Conecte com GitHub
3. **Não importe o projeto ainda** (faremos via CLI)

#### 2. Criar Conta Render
1. Acesse [render.com](https://render.com)
2. Conecte com GitHub
3. Teremos 2 serviços:
   - **Web Service** (Backend API)
   - **PostgreSQL** (Banco de dados)

### 🚀 Passo a Passo Deploy:

#### **A) Deploy Backend (Render)**

1. **Criar PostgreSQL Database:**
   - No dashboard Render, clique **New +** → **PostgreSQL**
   - Nome: `entrega-roteirizada-db`
   - Plano: Starter ($7/mês) ou Free (limitado)
   - Copie a **Internal Database URL** (começando com `postgresql://...`)

2. **Criar Web Service (Backend):**
   - **New +** → **Web Service**
   - Conecte ao repositório GitHub
   - Configurações:
     - **Name:** `entrega-roteirizada-api`
     - **Root Directory:** `backend`
     - **Build Command:** `npm install && npx prisma generate && npm run build`
     - **Start Command:** `npm start`
     - **Instance Type:** Starter ($7/mês) ou Free

3. **Variáveis de Ambiente (Render Backend):**
   ```env
   DATABASE_URL=<cole a Internal Database URL do PostgreSQL>
   PORT=4000
   REDIS_URL=<opcional - se usar Redis no Render>
   S3_ENDPOINT=<opcional - MinIO ou AWS S3>
   S3_ACCESS_KEY=<sua chave>
   S3_SECRET_KEY=<sua secret>
   S3_BUCKET=entregas
   MAPBOX_TOKEN=<seu token do Mapbox - opcional>
   NODE_ENV=production
   ```

4. **Deploy:**
   - Clique **Create Web Service**
   - Aguarde o build (5-10 min)
   - Anote a URL pública: `https://entrega-roteirizada-api.onrender.com`

5. **Executar Migrações:**
   - No dashboard do serviço → **Shell** (terminal)
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

#### **B) Deploy Frontend (Vercel)**

1. **Instalar Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy do Frontend:**
   ```bash
   cd frontend/panel
   vercel --prod
   ```

4. **Durante o Setup, Responda:**
   - **Set up and deploy?** → Y
   - **Which scope?** → Sua conta
   - **Link to existing project?** → N
   - **Project name?** → entrega-roteirizada
   - **Directory?** → `./`
   - **Override settings?** → Y
     - **Build Command:** `npm run build`
     - **Output Directory:** `out` (ou `.next` se não for estático)
     - **Install Command:** `npm install`

5. **Configurar Variáveis de Ambiente (Vercel):**
   - Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
   - Selecione o projeto → **Settings** → **Environment Variables**
   - Adicione:
     ```env
     NEXT_PUBLIC_API_URL=https://entrega-roteirizada-api.onrender.com
     NEXT_PUBLIC_MAPBOX_TOKEN=<seu token do Mapbox>
     ```

6. **Re-deploy com Variáveis:**
   ```bash
   vercel --prod
   ```

7. **Anote a URL pública:**
   ```
   https://entrega-roteirizada.vercel.app
   ```

#### **C) Deploy PWA Motorista (Vercel ou Netlify)**

1. **Deploy via Vercel CLI:**
   ```bash
   cd frontend/driver-pwa
   vercel --prod
   ```

2. **Variáveis de Ambiente:**
   ```env
   VITE_API_URL=https://entrega-roteirizada-api.onrender.com
   ```

3. **URL pública:**
   ```
   https://entrega-roteirizada-driver.vercel.app
   ```

### 🔄 Deploy Automático via GitHub Actions

Crie [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

```yaml
name: Deploy Produção

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Trigger Render Deploy
        run: |
          curl -X POST "https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID }}/deploys" \
            -H "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}" \
            -H "Content-Type: application/json"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend/panel
```

**Secrets Necessários (GitHub Settings → Secrets):**
- `VERCEL_TOKEN`: Token da Vercel (Settings → Tokens)
- `VERCEL_ORG_ID`: ID da organização Vercel
- `VERCEL_PROJECT_ID`: ID do projeto Vercel
- `RENDER_API_KEY`: API Key do Render (Account Settings → API Keys)
- `RENDER_SERVICE_ID`: ID do serviço backend no Render

---

## Opção 3: Produção Completa (AWS/Azure)

**Ideal para:** Grandes volumes (>50.000 entregas/mês), alta disponibilidade, compliance

[Conteúdo expandido na seção completa acima - veja documentação AWS/Azure]

---

## 📚 Recursos Adicionais

### Scripts Úteis

**Publish Demo (Windows PowerShell):**
```powershell
.\scripts\publish-demo.ps1 -Message "Deploy inicial"
```

**Publish Demo (macOS/Linux/WSL):**
```bash
./scripts/publish-demo.sh "Deploy inicial"
```

### Acesso ao Demo Estático

Após fazer push para `main`, o GitHub Actions automaticamente faz deploy do painel estático para GitHub Pages. Acesse em:

```
https://<seu-usuario>.github.io/entrega-roteirizada/
```

### Preview Local com Mock

Para testar o painel localmente com API simulada:

1. **Via variável de ambiente:**
   ```bash
   cd frontend/panel
   NEXT_PUBLIC_USE_MOCK=1 npm run dev
   ```

2. **Via URL:**
   ```
   http://localhost:3000?mock=1
   ```

---

## 🎯 Checklist de Deploy

### ✅ Antes do Deploy:

- [ ] Testes passando (`npm test`)
- [ ] Build local funciona (`npm run build`)
- [ ] Variáveis de ambiente configuradas
- [ ] Migrações do banco aplicadas
- [ ] Secrets do GitHub configurados
- [ ] Tokens de API externos criados (Mapbox, S3, etc)

### ✅ Depois do Deploy:

- [ ] Health check da API respondendo (`/health`)
- [ ] Frontend carregando corretamente
- [ ] WebSocket conectando
- [ ] Upload de arquivos funcionando
- [ ] Mapas carregando (Mapbox/Leaflet)
- [ ] SSL ativo (HTTPS)
- [ ] Monitoramento configurado
- [ ] Backups agendados (banco de dados)

---

## 💡 Dicas de Performance

1. **CDN para Frontend:** Use CloudFlare ou CloudFront
2. **Cache Redis:** Cachear rotas calculadas (TTL 1h)
3. **Compressão de Imagens:** Redimensionar fotos antes do upload
4. **Paginação:** Limitar entregas retornadas (max 100 por página)
5. **Índices no DB:** Adicionar índices em `status`, `assignedToId`, `createdAt`

---

**Última atualização:** Janeiro 2026

