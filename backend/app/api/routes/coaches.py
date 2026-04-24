import pathlib
import uuid
from typing import Annotated, Any

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.api.deps import SessionDep, get_current_active_superuser
from app import crud
from app.core.config import settings
from app.models import CoachCreate, CoachPublic, CoachUpdate, CoachesPublic, Message, User

router = APIRouter(prefix="/coaches", tags=["coaches"])

SuperUser = Annotated[User, Depends(get_current_active_superuser)]


def _save_photo(photo: UploadFile) -> str:
    """Save uploaded photo and return the URL path."""
    if photo.content_type not in settings.UPLOAD_ALLOWED_TYPES:
        raise HTTPException(
            status_code=422, detail=f"Unsupported file type: {photo.content_type}"
        )
    content = photo.file.read()
    if len(content) > settings.UPLOAD_MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=422, detail="File size exceeds 10MB limit")
    ext = pathlib.Path(photo.filename or "photo.jpg").suffix or ".jpg"
    filename = f"{uuid.uuid4()}{ext}"
    upload_dir = pathlib.Path(settings.UPLOAD_DIR) / "coaches"
    upload_dir.mkdir(parents=True, exist_ok=True)
    (upload_dir / filename).write_bytes(content)
    return f"/uploads/coaches/{filename}"


@router.post("/", response_model=CoachPublic, status_code=201)
def create_coach(
    session: SessionDep,
    _current_user: SuperUser,
    name: str = Form(...),
    role: str = Form(...),
    biography: str | None = Form(None),
    sort_order: int = Form(0),
    photo: UploadFile | None = File(None),
) -> Any:
    """Create a coach."""
    photo_url = _save_photo(photo) if photo and photo.filename else None
    coach_in = CoachCreate(name=name, role=role, biography=biography, sort_order=sort_order)
    return crud.create_coach(session=session, coach_in=coach_in, photo_url=photo_url)


@router.get("/", response_model=CoachesPublic)
def list_coaches(session: SessionDep, _current_user: SuperUser) -> Any:
    """List all coaches (admin)."""
    coaches = crud.get_coaches(session=session)
    return CoachesPublic(
        data=[CoachPublic.model_validate(c) for c in coaches],
        count=len(coaches),
    )


@router.patch("/{coach_id}", response_model=CoachPublic)
def update_coach(
    session: SessionDep,
    coach_id: uuid.UUID,
    _current_user: SuperUser,
    name: str | None = Form(None),
    role: str | None = Form(None),
    biography: str | None = Form(None),
    sort_order: int | None = Form(None),
    photo: UploadFile | None = File(None),
) -> Any:
    """Update a coach."""
    db_coach = crud.get_coach(session=session, coach_id=coach_id)
    if not db_coach:
        raise HTTPException(status_code=404, detail="Coach not found")
    photo_url = _save_photo(photo) if photo and photo.filename else None
    coach_in = CoachUpdate(name=name, role=role, biography=biography, sort_order=sort_order)
    return crud.update_coach(
        session=session, db_coach=db_coach, coach_in=coach_in, photo_url=photo_url
    )


@router.delete("/{coach_id}", response_model=Message)
def delete_coach(
    session: SessionDep, coach_id: uuid.UUID, _current_user: SuperUser
) -> Any:
    """Delete a coach."""
    db_coach = crud.get_coach(session=session, coach_id=coach_id)
    if not db_coach:
        raise HTTPException(status_code=404, detail="Coach not found")
    crud.delete_coach(session=session, db_coach=db_coach)
    return Message(message="Coach deleted")
