# Deploy instructions (Vercel + Render)

This repository supports automatic deploys for the Panel (Next.js) to **Vercel** and the API (backend) to **Render** via GitHub Actions.

## Required secrets (GitHub repository settings → Secrets)
- VERCEL_TOKEN: personal token with deploy permissions
- VERCEL_ORG_ID: your Vercel organization id
- VERCEL_PROJECT_ID: the Vercel project id for the panel
- RENDER_API_KEY: API key for Render (Service API key)
- RENDER_SERVICE_ID: Render service id for the backend
- PANEL_URL: Public URL of the deployed panel (e.g. https://app.example.com)
- API_URL: Public URL of the deployed API (e.g. https://api.example.com)

## Workflow
- `.github/workflows/deploy.yml` runs on pushes to `main` and can be triggered manually.
- Steps:
  1. Build panel and deploy to Vercel.
  2. Trigger a Render deploy for the backend via Render API.
  3. Run smoke checks against `/health` and the Panel homepage.

## How to run locally
1. Create the infra: `docker-compose up -d postgres redis minio`
2. Set `DATABASE_URL` env var for the backend and run:
   - `pnpm --prefix backend install`
   - `pnpm --prefix backend run prisma:deploy`
   - `pnpm --prefix backend run seed`
   - `pnpm --prefix backend dev`
3. Start the panel: `pnpm --prefix frontend/panel dev`
4. Run smoke script: `./scripts/smoke.sh` (requires `PANEL_URL` and `API_URL` env vars set)

## Notes
- Make sure to store tokens and URLs as GitHub Secrets. Do not check credentials into the repo.
- If you prefer, I can configure the Vercel and Render deployments directly (I will need collaborator access or you can add me as a team member).

---

## Quick public demo (no secrets)
If you do not want to create provider accounts or supply secrets, the repository includes a static demo option:
- The panel is exported as a static site and deployed to GitHub Pages using the `gh-pages` workflow on push to `main`.
- The static demo uses a client-side mock API (stored in localStorage) and a mock socket for realtime events. The demo is enabled by default in the GH Pages build.
- To preview locally with mocks: set `NEXT_PUBLIC_USE_MOCK=1` and run `npm run dev` inside `frontend/panel`, or append `?mock=1` to the URL.

### One-step publish scripts
For convenience, two scripts are included in the `scripts/` folder to commit and push your changes and trigger the GH Pages workflow automatically:

- Bash (macOS / Linux / Windows WSL): `./scripts/publish-demo.sh "your commit message"`
- PowerShell (Windows): `.\scripts\publish-demo.ps1 -Message "your commit message"`

If you prefer to run the commands manually, run:

- `git add -A && git commit -m "chore: publish demo to gh-pages" && git push origin main`

After pushing, open the repository Actions tab and watch the "Deploy Panel to GitHub Pages (demo)" workflow run; when it finishes the public URL will be available at `https://<github-username>.github.io/<repo-name>/`.

