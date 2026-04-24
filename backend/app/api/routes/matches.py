import uuid
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Query

from app.api.deps import SessionDep, get_current_active_superuser
from app import crud
from app.models import (
    MatchCreate,
    MatchPublic,
    MatchPatch,
    MatchesPublic,
    Message,
    User,
)

router = APIRouter(prefix="/matches", tags=["matches"])

SuperUser = Annotated[User, Depends(get_current_active_superuser)]


@router.post("/", response_model=MatchPublic, status_code=201)
def create_match(
    session: SessionDep, current_user: SuperUser, match_in: MatchCreate
) -> Any:
    """Create a match."""
    return crud.create_match(
        session=session, match_in=match_in, created_by_id=current_user.id
    )


@router.get("/", response_model=MatchesPublic)
def list_matches(
    session: SessionDep,
    _current_user: SuperUser,
    status: str | None = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
) -> Any:
    """List matches (admin)."""
    matches, count = crud.get_matches(
        session=session, status=status, skip=skip, limit=limit
    )
    return MatchesPublic(
        data=[MatchPublic.model_validate(m) for m in matches],
        count=count,
    )


@router.patch("/{match_id}", response_model=MatchPublic)
def update_match(
    session: SessionDep,
    match_id: uuid.UUID,
    _current_user: SuperUser,
    match_in: MatchPatch,
) -> Any:
    """Update a match (including status change)."""
    db_match = crud.get_match(session=session, match_id=match_id)
    if not db_match:
        raise HTTPException(status_code=404, detail="Match not found")
    return crud.update_match(session=session, db_match=db_match, match_in=match_in)


@router.delete("/{match_id}", response_model=Message)
def delete_match(
    session: SessionDep, match_id: uuid.UUID, _current_user: SuperUser
) -> Any:
    """Delete a match."""
    db_match = crud.get_match(session=session, match_id=match_id)
    if not db_match:
        raise HTTPException(status_code=404, detail="Match not found")
    crud.delete_match(session=session, db_match=db_match)
    return Message(message="Match deleted")
