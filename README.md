<div align="center">

# 🚚 Entrega Roteirizada

**Sistema logístico leve para pequenos comércios organizarem entregas**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

[Demo ao Vivo](https://seu-usuario.github.io/entrega-roteirizada/) • [Documentação](./DEPLOY.md) • [Reportar Bug](https://github.com/seu-usuario/entrega-roteirizada/issues)

</div>

---

## 📖 Sobre o Projeto

**Entrega Roteirizada** é uma plataforma completa de gestão de entregas, ideal para pequenos negócios que precisam organizar suas entregas sem pagar por soluções caras.

### 🎯 Problema que Resolve

Pequenos negócios (restaurantes, lojas, mercados) sofrem com:
- ❌ Falta de controle sobre entregas (quem leva, quando chega)
- ❌ Rotas ineficientes (gasto de combustível e tempo)
- ❌ Nenhuma prova de entrega (cliente reclama que não recebeu)

### ✨ Solução

- ✅ **Painel Web** para operadores gerenciarem entregas e rotas
- ✅ **Roteirização inteligente** com otimização de percurso
- ✅ **PWA para motoristas** funcionando offline
- ✅ **Prova de entrega** com foto e assinatura digital
- ✅ **Acompanhamento em tempo real** via WebSocket
- ✅ **100% gratuito e open-source**

---

## 🖼️ Screenshots

<div align="center">

### Painel Web (Operador)

<img src="docs/screenshots/dashboard.png" alt="Dashboard" width="800"/>

*Dashboard com KPIs, próximas saídas e alertas*

---

<img src="docs/screenshots/entregas.png" alt="Lista de Entregas" width="800"/>

*Gerenciamento de entregas com filtros e detalhes*

---

<img src="docs/screenshots/roteirizacao.png" alt="Roteirização" width="800"/>

*Otimização de rotas com visualização no mapa*

---

<img src="docs/screenshots/mapa-live.png" alt="Mapa Live" width="800"/>

*Tracking em tempo real de motoristas e entregas*

</div>

---

## 🚀 Funcionalidades

### 📦 Painel Web (Operador)

- ✅ **Dashboard** — KPIs, próximas saídas, alertas
- ✅ **CRUD Entregas** — Cadastro com cliente, endereço, valor, janela de entrega
- ✅ **Roteirização** — Otimização automática de rotas (Mapbox/OSRM)
- ✅ **Atribuição** — Designar entregas para motoristas
- ✅ **Mapa Live** — Visualização em tempo real de motoristas e entregas
- ✅ **Gerenciar Motoristas** — Capacidade, veículo, SLA
- ✅ **Prova de Entrega** — Visualizar fotos e assinaturas
- ✅ **Filtros e Busca** — Por status, motorista, data
- ✅ **Responsive** — Otimizado para mobile e tablet

### 📱 PWA Motorista

- ✅ **Lista de Entregas** — Visualizar entregas atribuídas
- ✅ **Navegação** — Link para Google Maps/Waze
- ✅ **Check-in** — Marcar entrega como concluída
- ✅ **Prova de Entrega** — Capturar foto e/ou assinatura digital
- ✅ **Offline-First** — Funciona sem internet (IndexedDB)
- ✅ **Sincronização** — Upload automático quando online
- ✅ **Push Notifications** — Novas rotas atribuídas

### 🔧 Backend (API)

- ✅ **REST API** — CRUD completo de entregas, motoristas, rotas
- ✅ **WebSocket** — Real-time para status de entregas
- ✅ **Otimização de Rotas** — Integração Mapbox/OSRM
- ✅ **Upload de Arquivos** — S3/MinIO para fotos
- ✅ **Autenticação** — JWT (opcional)
- ✅ **Auditoria** — Histórico de mudanças

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  ┌──────────────┐              ┌──────────────┐             │
│  │ Painel Web   │              │ PWA Motorista│             │
│  │ (Next.js)    │              │ (React+Vite) │             │
│  └───────┬──────┘              └───────┬──────┘             │
└──────────┼─────────────────────────────┼────────────────────┘
           │                             │
           │         HTTPS/WSS           │
           │                             │
┌──────────▼─────────────────────────────▼────────────────────┐
│                         Backend                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Node.js + Express + Socket.IO + Prisma              │   │
│  └───────┬──────────────────┬─────────────────┬─────────┘   │
└──────────┼──────────────────┼─────────────────┼─────────────┘
           │                  │                 │
      ┌────▼─────┐      ┌─────▼──────┐    ┌────▼────┐
      │PostgreSQL│      │   Redis    │    │ S3/MinIO│
      │  (Dados) │      │  (Cache)   │    │ (Fotos) │
      └──────────┘      └────────────┘    └─────────┘
```

---

## 🛠️ Stack Tecnológica

### Frontend

| Tecnologia | Uso |
|------------|-----|
| [Next.js 14](https://nextjs.org/) | Framework React para o painel |
| [React 18](https://react.dev/) | Biblioteca UI |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Estilização |
| [Leaflet](https://leafletjs.com/) | Mapas interativos |
| [Socket.IO Client](https://socket.io/) | Real-time |
| [SWR](https://swr.vercel.app/) | Data fetching |
| [Vite](https://vitejs.dev/) | Build tool (PWA) |
| [Workbox](https://developers.google.com/web/tools/workbox) | Service Worker |

### Backend

| Tecnologia | Uso |
|------------|-----|
| [Node.js 20](https://nodejs.org/) | Runtime |
| [Express](https://expressjs.com/) | Framework web |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Prisma](https://www.prisma.io/) | ORM |
| [Socket.IO](https://socket.io/) | WebSocket |
| [PostgreSQL](https://www.postgresql.org/) | Banco de dados |
| [Redis](https://redis.io/) | Cache/fila |
| [MinIO](https://min.io/) | Storage (S3-compatible) |

### DevOps

| Tecnologia | Uso |
|------------|-----|
| [Docker](https://www.docker.com/) | Containerização |
| [Docker Compose](https://docs.docker.com/compose/) | Orquestração local |
| [GitHub Actions](https://github.com/features/actions) | CI/CD |
| [Vercel](https://vercel.com/) | Deploy frontend |
| [Render](https://render.com/) | Deploy backend |

---

## 📂 Estrutura do Projeto

```
entrega-roteirizada/
├── backend/                  # API Node.js + Express
│   ├── src/
│   │   ├── app.ts           # Configuração Express
│   │   ├── index.ts         # Entry point
│   │   ├── socket.ts        # WebSocket handlers
│   │   ├── routes/          # Endpoints REST
│   │   │   ├── deliveries.ts
│   │   │   ├── drivers.ts
│   │   │   └── routes.ts
│   │   └── __tests__/       # Testes unitários
│   ├── prisma/
│   │   └── schema.prisma    # Schema do banco
│   └── package.json
│
├── frontend/
│   ├── panel/               # Painel Web (Next.js)
│   │   ├── pages/
│   │   │   ├── index.tsx    # Dashboard
│   │   │   ├── entregas/    # CRUD entregas
│   │   │   ├── roteirizacao/# Otimização rotas
│   │   │   └── mapa/        # Mapa live
│   │   ├── components/      # Componentes reutilizáveis
│   │   └── e2e/             # Testes E2E (Playwright)
│   │
│   └── driver-pwa/          # PWA Motorista (Vite)
│       ├── src/
│       │   ├── App.tsx
│       │   ├── sw.ts        # Service Worker
│       │   └── pages/
│       └── manifest.webmanifest
│
├── docs/                    # Documentação
│   ├── erd.mmd             # Diagrama ER
│   ├── lgpd.md             # Conformidade LGPD
│   └── screenshots/        # Screenshots para README
│
├── docker-compose.yml      # Setup dev local
├── DEPLOY.md               # Guia de deploy
└── README.md               # Este arquivo
```

---

## 🚦 Começando

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- [Docker](https://www.docker.com/) e Docker Compose
- [pnpm](https://pnpm.io/) (ou npm/yarn)
- [Git](https://git-scm.com/)

### Instalação Local

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/entrega-roteirizada.git
   cd entrega-roteirizada
   ```

2. **Copie o arquivo de ambiente:**
   ```bash
   cp .env.example .env
   ```

3. **Edite `.env` com suas configurações:**
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/entrega_roteirizada
   REDIS_URL=redis://localhost:6379
   S3_ENDPOINT=http://localhost:9000
   S3_ACCESS_KEY=minioadmin
   S3_SECRET_KEY=minioadmin
   MAPBOX_TOKEN=seu_token_aqui
   ```

4. **Inicie os serviços (PostgreSQL, Redis, MinIO):**
   ```bash
   docker-compose up -d
   ```

5. **Backend:**
   ```bash
   cd backend
   pnpm install
   pnpm prisma:generate
   pnpm prisma:migrate
   pnpm seed
   pnpm dev
   ```
   API rodando em: `http://localhost:4000`

6. **Painel Web:**
   ```bash
   cd frontend/panel
   pnpm install
   pnpm dev
   ```
   Painel em: `http://localhost:3000`

7. **PWA Motorista:**
   ```bash
   cd frontend/driver-pwa
   pnpm install
   pnpm dev
   ```
   PWA em: `http://localhost:5173`

### Acesse:

- **Painel:** http://localhost:3000
- **API:** http://localhost:4000/health
- **MinIO Console:** http://localhost:9001 (minioadmin / minioadmin)

---

## 🧪 Testes

### Backend (Unit + Integration)
```bash
cd backend
pnpm test
```

### Frontend (E2E com Playwright)
```bash
cd frontend/panel
pnpm test:e2e
```

### Smoke Tests
```bash
./scripts/smoke.sh
```

---

## 🚀 Deploy

Consulte o [**Guia de Deploy**](DEPLOY.md) para instruções detalhadas sobre:

- ✅ **Deploy Rápido (GitHub Pages)** — Demo estático gratuito
- ✅ **Deploy Produção (Vercel + Render)** — ~$7-15/mês
- ✅ **Deploy Enterprise (AWS/Azure)** — Escalável e completo

### Deploy Rápido (Demo)

```bash
# Windows PowerShell
.\scripts\publish-demo.ps1 -Message "Deploy inicial"

# macOS/Linux/WSL
./scripts/publish-demo.sh "Deploy inicial"
```

Demo disponível em: `https://seu-usuario.github.io/entrega-roteirizada/`

---

## 📚 Documentação

- [Guia de Deploy](DEPLOY.md) — Instruções completas de deploy
- [API Routes](backend/README_ROUTES.md) — Documentação dos endpoints
- [Diagrama ER](docs/erd.mmd) — Modelo de dados
- [LGPD](docs/lgpd.md) — Conformidade com privacidade

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Siga os passos:

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Diretrizes

- ✅ Siga o padrão de código (ESLint + Prettier)
- ✅ Adicione testes para novas funcionalidades
- ✅ Atualize a documentação quando necessário
- ✅ Use commits semânticos (feat, fix, docs, etc)

---

## 🗺️ Roadmap

### ✅ MVP (Concluído)

- [x] CRUD completo de entregas
- [x] Atribuição de motoristas
- [x] Roteirização otimizada (Mapbox/OSRM)
- [x] PWA offline-first
- [x] Prova de entrega (foto/assinatura)
- [x] Real-time via WebSocket
- [x] Deploy automático

### 🚧 v2.0 (Em Desenvolvimento)

- [ ] Autenticação JWT
- [ ] Push notifications
- [ ] Relatórios exportáveis (CSV/PDF)
- [ ] Integração WhatsApp (aviso ao cliente)
- [ ] Multi-tenancy (múltiplas empresas)

### 🔮 Futuro

- [ ] App mobile nativo (React Native)
- [ ] Analytics e dashboards avançados
- [ ] Integração com APIs de pagamento
- [ ] Cálculo automático de custo por rota
- [ ] Machine Learning para previsão de demanda

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Autores

- **Seu Nome** - [@seu-usuario](https://github.com/seu-usuario)

---

## 🙏 Agradecimentos

- [Mapbox](https://www.mapbox.com/) — API de mapas e rotas
- [OpenStreetMap](https://www.openstreetmap.org/) — Dados geográficos
- [OSRM](http://project-osrm.org/) — Engine de roteamento open-source
- Comunidade open-source por todas as ferramentas incríveis

---

## 📧 Contato

- **Email:** seu-email@example.com
- **LinkedIn:** [Seu Nome](https://linkedin.com/in/seu-perfil)
- **GitHub Issues:** [Reportar Bug](https://github.com/seu-usuario/entrega-roteirizada/issues)

---

<div align="center">

**⭐ Se este projeto foi útil, deixe uma estrela!**

[⬆ Voltar ao topo](#-entrega-roteirizada)

</div>