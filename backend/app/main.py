import pathlib
import uuid

import sentry_sdk
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.routing import APIRoute
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware

from app import crud
from app.api.deps import SessionDep
from app.api.main import api_router
from app.core.config import settings


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)

# Set all CORS enabled origins
if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

# Serve uploaded files
uploads_path = pathlib.Path(settings.UPLOAD_DIR)
uploads_path.mkdir(parents=True, exist_ok=True)


@app.get(
    "/uploads/matches/{match_id}/{filename:path}",
    include_in_schema=False,
    tags=["uploads"],
)
def get_match_upload(
    session: SessionDep, match_id: uuid.UUID, filename: str
) -> FileResponse:
    """Serve match uploads only while their match is public."""
    match = crud.get_match(session=session, match_id=match_id)
    if not match or not match.is_public:
        raise HTTPException(status_code=404, detail="File not found")

    match_dir = (uploads_path / "matches" / str(match_id)).resolve()
    file_path = (match_dir / filename).resolve()
    if match_dir not in file_path.parents or not file_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path)


app.mount("/uploads", StaticFiles(directory=str(uploads_path)), name="uploads")
