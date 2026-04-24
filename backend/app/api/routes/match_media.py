import pathlib
import uuid
from typing import Annotated, Any
from urllib.parse import urlparse

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.api.deps import SessionDep, get_current_active_superuser
from app import crud
from app.core.config import settings
from app.models import MatchMediaPublic, MatchMediaVideoCreate, Message, User

router = APIRouter(prefix="/matches", tags=["match-media"])

SuperUser = Annotated[User, Depends(get_current_active_superuser)]


@router.post(
    "/{match_id}/media/photos", response_model=MatchMediaPublic, status_code=201
)
def upload_match_photo(
    session: SessionDep,
    match_id: uuid.UUID,
    _current_user: SuperUser,
    photo: UploadFile = File(...),
    caption: str | None = Form(None),
) -> Any:
    """Upload a photo to a match."""
    match = crud.get_match(session=session, match_id=match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    if photo.content_type not in settings.UPLOAD_ALLOWED_TYPES:
        raise HTTPException(
            status_code=422, detail=f"Unsupported file type: {photo.content_type}"
        )
    content = photo.file.read()
    if len(content) > settings.UPLOAD_MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=422, detail="File size exceeds 10MB limit")
    ext = pathlib.Path(photo.filename or "photo.jpg").suffix or ".jpg"
    filename = f"{uuid.uuid4()}{ext}"
    upload_dir = pathlib.Path(settings.UPLOAD_DIR) / "matches" / str(match_id)
    upload_dir.mkdir(parents=True, exist_ok=True)
    (upload_dir / filename).write_bytes(content)
    file_path = f"/uploads/matches/{match_id}/{filename}"
    return crud.create_match_media_photo(
        session=session, match_id=match_id, file_path=file_path, caption=caption
    )


@router.post(
    "/{match_id}/media/videos", response_model=MatchMediaPublic, status_code=201
)
def add_match_video_link(
    session: SessionDep,
    match_id: uuid.UUID,
    _current_user: SuperUser,
    video_in: MatchMediaVideoCreate,
) -> Any:
    """Add an external video link to a match."""
    match = crud.get_match(session=session, match_id=match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    parsed = urlparse(video_in.url)
    if not parsed.scheme or not parsed.netloc:
        raise HTTPException(status_code=422, detail="Invalid URL format")
    return crud.create_match_media_video(
        session=session, match_id=match_id, video_in=video_in
    )


@router.delete("/{match_id}/media/{media_id}", response_model=Message)
def delete_match_media(
    session: SessionDep,
    match_id: uuid.UUID,
    media_id: uuid.UUID,
    _current_user: SuperUser,
) -> Any:
    """Delete a match media item."""
    db_media = crud.get_match_media(session=session, media_id=media_id)
    if not db_media or db_media.match_id != match_id:
        raise HTTPException(status_code=404, detail="Media not found")
    crud.delete_match_media(session=session, db_media=db_media)
    return Message(message="Media deleted")
