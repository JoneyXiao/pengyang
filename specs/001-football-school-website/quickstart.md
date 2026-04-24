# Quickstart: Football School Team Website

**Feature**: 001-football-school-website
**Date**: 2026-04-23

## Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ (for frontend development)
- Python 3.11+ with uv (for backend development)
- Git on branch `001-football-school-website`

## Local Development Setup

### 1. Start the full stack

```bash
docker compose up -d
```

This starts PostgreSQL, the backend (FastAPI), and the frontend (Vite dev server).

### 2. Backend-only development

```bash
cd backend
# Apply migrations (after adding new models)
alembic upgrade head

# Run backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend-only development

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### 4. Run tests

**Backend**:
```bash
cd backend
bash scripts/test.sh
```

**Frontend (Playwright e2e)**:
```bash
cd frontend
npx playwright test
```

## Key Development Workflow

1. **Add models** → `backend/app/models.py`
2. **Create migration** → `cd backend && alembic revision --autogenerate -m "add football tables"`
3. **Apply migration** → `alembic upgrade head`
4. **Add API routes** → `backend/app/api/routes/`
5. **Register routes** → `backend/app/api/main.py`
6. **Regenerate client** → `cd .. && bash scripts/generate-client.sh`
7. **Add frontend pages** → `frontend/src/routes/`
8. **Test** → Backend: `pytest`, Frontend: `playwright test`

## File Upload Configuration

Photo uploads are stored in a local directory. Configure via environment variable:

```env
UPLOAD_DIR=/app/uploads
```

In Docker Compose, the upload directory is a named volume for persistence.

## Verification Checklist

After implementation, verify:

- [ ] `docker compose up` starts without errors
- [ ] Landing page loads at `/`
- [ ] Team intro page loads at `/team`
- [ ] Coach/player page loads at `/roster`
- [ ] Match schedule loads at `/matches`
- [ ] Admin login works and redirects to admin dashboard
- [ ] Admin can create a match via `/matches` admin page
- [ ] Admin can add coaches/players via admin pages
- [ ] Photo upload works for match media
- [ ] External video link can be added to a match
- [ ] Real-time updates appear within 10 seconds during a live match
- [ ] Players without consent show limited profiles only
