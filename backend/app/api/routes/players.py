import pathlib
import uuid
from typing import Annotated, Any

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.api.deps import SessionDep, get_current_active_superuser
from app import crud
from app.core.config import settings
from app.models import (
    Message,
    PlayerAdmin,
    PlayerCreate,
    PlayerUpdate,
    PlayersAdminPublic,
    User,
)

router = APIRouter(prefix="/players", tags=["players"])

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
    upload_dir = pathlib.Path(settings.UPLOAD_DIR) / "players"
    upload_dir.mkdir(parents=True, exist_ok=True)
    (upload_dir / filename).write_bytes(content)
    return f"/uploads/players/{filename}"


@router.post("/", response_model=PlayerAdmin, status_code=201)
def create_player(
    session: SessionDep,
    _current_user: SuperUser,
    name: str = Form(...),
    first_name: str = Form(...),
    position: str | None = Form(None),
    jersey_number: int | None = Form(None),
    biography: str | None = Form(None),
    has_parental_consent: bool = Form(False),
    sort_order: int = Form(0),
    photo: UploadFile | None = File(None),
) -> Any:
    """Create a player."""
    photo_url = _save_photo(photo) if photo and photo.filename else None
    player_in = PlayerCreate(
        name=name,
        first_name=first_name,
        position=position,
        jersey_number=jersey_number,
        biography=biography,
        has_parental_consent=has_parental_consent,
        sort_order=sort_order,
    )
    player = crud.create_player(session=session, player_in=player_in, photo_url=photo_url)
    return PlayerAdmin.model_validate(player)


@router.get("/", response_model=PlayersAdminPublic)
def list_players(session: SessionDep, _current_user: SuperUser) -> Any:
    """List all players (admin, full data)."""
    players = crud.get_players(session=session)
    return {
        "data": [PlayerAdmin.model_validate(p) for p in players],
        "count": len(players),
    }


@router.patch("/{player_id}", response_model=PlayerAdmin)
def update_player(
    session: SessionDep,
    player_id: uuid.UUID,
    _current_user: SuperUser,
    name: str | None = Form(None),
    first_name: str | None = Form(None),
    position: str | None = Form(None),
    jersey_number: int | None = Form(None),
    biography: str | None = Form(None),
    has_parental_consent: bool | None = Form(None),
    sort_order: int | None = Form(None),
    photo: UploadFile | None = File(None),
) -> Any:
    """Update a player."""
    db_player = crud.get_player(session=session, player_id=player_id)
    if not db_player:
        raise HTTPException(status_code=404, detail="Player not found")
    photo_url = _save_photo(photo) if photo and photo.filename else None
    player_in = PlayerUpdate(
        name=name,
        first_name=first_name,
        position=position,
        jersey_number=jersey_number,
        biography=biography,
        has_parental_consent=has_parental_consent,
        sort_order=sort_order,
    )
    player = crud.update_player(
        session=session, db_player=db_player, player_in=player_in, photo_url=photo_url
    )
    return PlayerAdmin.model_validate(player)


@router.delete("/{player_id}", response_model=Message)
def delete_player(
    session: SessionDep, player_id: uuid.UUID, _current_user: SuperUser
) -> Any:
    """Delete a player."""
    db_player = crud.get_player(session=session, player_id=player_id)
    if not db_player:
        raise HTTPException(status_code=404, detail="Player not found")
    crud.delete_player(session=session, db_player=db_player)
    return Message(message="Player deleted")
