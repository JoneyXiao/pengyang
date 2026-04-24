from typing import Annotated, Any

import nh3
from fastapi import APIRouter, Depends

from app.api.deps import SessionDep, get_current_active_superuser
from app import crud
from app.models import TeamContentPublic, TeamContentUpdate, User

router = APIRouter(prefix="/team-content", tags=["team-content"])

SuperUser = Annotated[User, Depends(get_current_active_superuser)]


@router.get("/", response_model=TeamContentPublic)
def get_team_content(session: SessionDep, _current_user: SuperUser) -> Any:
    """Get current team content (admin)."""
    tc = crud.get_team_content(session=session)
    if not tc:
        return TeamContentPublic(content="", updated_at=None)
    return tc


@router.put("/", response_model=TeamContentPublic)
def update_team_content(
    session: SessionDep,
    current_user: SuperUser,
    content_in: TeamContentUpdate,
) -> Any:
    """Update team introduction content. HTML is sanitized server-side."""
    sanitized = nh3.clean(content_in.content)
    content_in.content = sanitized
    tc = crud.update_team_content(
        session=session, content_in=content_in, updated_by_id=current_user.id
    )
    return tc
