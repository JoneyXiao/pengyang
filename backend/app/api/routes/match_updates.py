import uuid
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import SessionDep, get_current_active_superuser
from app import crud
from app.models import MatchUpdateCreate, MatchUpdatePublic, Message, User

router = APIRouter(prefix="/matches", tags=["match-updates"])

SuperUser = Annotated[User, Depends(get_current_active_superuser)]


@router.post(
    "/{match_id}/updates", response_model=MatchUpdatePublic, status_code=201
)
def create_match_update(
    session: SessionDep,
    match_id: uuid.UUID,
    _current_user: SuperUser,
    update_in: MatchUpdateCreate,
) -> Any:
    """Post a real-time update to a match."""
    match = crud.get_match(session=session, match_id=match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    return crud.create_match_update(
        session=session, match_id=match_id, update_in=update_in
    )


@router.delete("/{match_id}/updates/{update_id}", response_model=Message)
def delete_match_update(
    session: SessionDep,
    match_id: uuid.UUID,
    update_id: uuid.UUID,
    _current_user: SuperUser,
) -> Any:
    """Delete a match update."""
    db_update = crud.get_match_update(session=session, update_id=update_id)
    if not db_update or db_update.match_id != match_id:
        raise HTTPException(status_code=404, detail="Update not found")
    crud.delete_match_update(session=session, db_update=db_update)
    return Message(message="Update deleted")
