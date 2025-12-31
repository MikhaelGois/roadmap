# Backend — entrega-roteirizada

Pré-requisitos: Postgres rodando (veja `docker-compose.yml`).

1. Instale dependências: `pnpm install` (ou `npm install`)
2. Gere o Prisma client: `pnpm prisma:generate`
3. Rode migrações (em dev): `pnpm prisma:migrate`
4. Rode seed: `pnpm seed`
5. Rode em dev: `pnpm dev`

Endpoints principais:
- GET /deliveries
- POST /deliveries
- POST /deliveries/:id/assign { driverId }
- POST /deliveries/:id/status { status }
- POST /deliveries/:id/proof (multipart form-data file)

Socket.IO: conectado ao server (ver `src/socket.ts`).
