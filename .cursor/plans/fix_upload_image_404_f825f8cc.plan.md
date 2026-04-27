---
name: Fix upload image 404
overview: Uploaded images return 404 because the browser requests `/uploads/...` from the frontend origin (port 5173), but the files are only served by the FastAPI backend (port 8000). The fix is to proxy `/uploads` requests to the backend in both Vite dev and Docker nginx.
todos:
  - id: vite-proxy
    content: Add `server.proxy` for `/uploads` in `frontend/vite.config.ts`
    status: completed
  - id: nginx-proxy
    content: Add `location /uploads` proxy_pass block in `frontend/nginx.conf`
    status: completed
isProject: false
---

# Fix uploaded image 404 error

## Root cause

The backend saves uploaded files to disk and stores **root-relative** paths like `/uploads/matches/{match_id}/{uuid}.jpg` in the database. The frontend renders these as `<img src={file_path}>`, which the browser resolves against the **frontend** origin (`http://localhost:5173`).

However, the uploaded files are only served by the **FastAPI backend** at `http://localhost:8000/uploads/...` via `StaticFiles`:

```41:41:backend/app/main.py
app.mount("/uploads", StaticFiles(directory=str(uploads_path)), name="uploads")
```

The frontend has **no proxy** for `/uploads`:
- [frontend/vite.config.ts](frontend/vite.config.ts) has no `server.proxy`
- [frontend/nginx.conf](frontend/nginx.conf) (used in Docker) has no `/uploads` location

So `http://localhost:5173/uploads/...` hits the frontend server, which doesn't have these files -- resulting in a 404.

## Fix

Proxy `/uploads` requests from the frontend to the backend in both environments:

### 1. Vite dev server proxy (for `bun run dev`)

In [frontend/vite.config.ts](frontend/vite.config.ts), add a `server.proxy` entry:

```typescript
server: {
  proxy: {
    "/uploads": "http://localhost:8000",
  },
},
```

This forwards any request starting with `/uploads` to the backend during local development.

### 2. Nginx proxy (for Docker Compose)

In [frontend/nginx.conf](frontend/nginx.conf), add a `location /uploads` block before the existing `location /`:

```nginx
location /uploads {
    proxy_pass http://backend:8000;
}
```

Inside Docker Compose, `backend` resolves to the backend service (both `compose.yml` and `compose.override.yml` define it). This works for both local Docker dev and production deployments.

## Files changed

- [frontend/vite.config.ts](frontend/vite.config.ts) -- add `server.proxy` for `/uploads`
- [frontend/nginx.conf](frontend/nginx.conf) -- add nginx reverse proxy for `/uploads`

## No frontend code changes needed

The existing root-relative `src="/uploads/..."` pattern in components (`MediaUploadCard.tsx`, `MediaGallery.tsx`, `ProfileCard.tsx`, `players.tsx`, `coaches.tsx`) remains correct -- the proxy makes these paths resolve to the backend transparently.