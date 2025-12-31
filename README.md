# Entrega Roteirizada

Projeto 7 — Entrega Roteirizada

Uma plataforma leve para pequenos comércios organizarem entregas: painel web (Next.js), PWA motorista (offline-first), backend (Node.js + Express + TypeScript), PostgreSQL, Redis, uploads em S3/MinIO, e integração com Mapbox/OSRM.

## Estrutura do projeto

- `backend/` — API REST + WebSocket (Express + TypeScript + Prisma)
- `frontend/panel/` — Painel Web (Next.js + TypeScript)
- `frontend/driver-pwa/` — PWA Motorista (React + Vite + TypeScript)
- `docker-compose.yml` — Desenvolvimento com Postgres, Redis, MinIO
- `DEPLOY.md` — Deployment instructions for Vercel (panel) and Render (API)

## Rodando em desenvolvimento

1. Copie `.env.example` para `.env` e ajuste variáveis.
2. `docker-compose up -d` (start Postgres, Redis, MinIO)
3. Backend: `cd backend && pnpm install && pnpm dev`
4. Painel: `cd frontend/panel && pnpm install && pnpm dev`
5. PWA: `cd frontend/driver-pwa && pnpm install && pnpm dev`

## Roadmap
- MVP: CRUD entregas, atribuição a motorista, rota otimizada, PWA offline com prova de entrega (foto/assinatura), real-time status.
- Evoluir: otimização de rotas, analytics, integrações com serviços de pagamento e logística.

---

Se quiser, executo agora a primeira implantação local (docker-compose) e configuro variáveis de ambiente padrão. Para que eu gere os arquivos finais, confirme as preferências: **Express + TypeScript + Prisma**, **Mapbox (padrão)**, **MinIO para dev (S3 compatible)**. Se quiser outro stack (NestJS / TypeORM / OSRM self-host), diga antes de prosseguir.