import uuid
from datetime import datetime
from typing import Any

from fastapi import APIRouter, HTTPException, Query

from app.api.deps import SessionDep
from app import crud
from app.models import (
    CoachesPublic,
    CoachPublic,
    LandingPageData,
    MatchDetailPublic,
    MatchesPublic,
    MatchMediaPublic,
    MatchPublic,
    MatchUpdatePublic,
    MatchUpdatesPublic,
    PlayerPublic,
    PlayersPublic,
    TeamContentPublic,
)

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/landing", response_model=LandingPageData)
def get_landing_page(session: SessionDep) -> Any:
    """Landing page aggregate data."""
    upcoming, _ = crud.get_matches(session=session, status="upcoming", limit=5)
    recent, _ = crud.get_matches(session=session, status="completed", limit=5)
    return LandingPageData(
        upcoming_matches=[MatchPublic.model_validate(m) for m in upcoming],
        recent_matches=[MatchPublic.model_validate(m) for m in recent],
        team_name="深圳市龙华区观湖实验学校 - 鹏飏",
    )


@router.get("/team-content", response_model=TeamContentPublic)
def get_team_content(session: SessionDep) -> Any:
    """Team introduction page content."""
    tc = crud.get_team_content(session=session)
    if not tc:
        return TeamContentPublic(content="", updated_at=None)
    return tc


@router.get("/coaches", response_model=CoachesPublic)
def get_coaches(session: SessionDep) -> Any:
    """List all coaches (public)."""
    coaches = crud.get_coaches(session=session)
    return CoachesPublic(
        data=[CoachPublic.model_validate(c) for c in coaches],
        count=len(coaches),
    )


@router.get("/players", response_model=PlayersPublic)
def get_players(session: SessionDep) -> Any:
    """List all players (public, consent-filtered)."""
    players = crud.get_players(session=session)
    public_players = []
    for p in players:
        if p.has_parental_consent:
            public_players.append(
                PlayerPublic(
                    id=p.id,
                    first_name=p.first_name,
                    position=p.position,
                    jersey_number=p.jersey_number,
                    biography=p.biography,
                    photo_url=p.photo_url,
                    has_full_profile=True,
                    sort_order=p.sort_order,
                )
            )
        else:
            public_players.append(
                PlayerPublic(
                    id=p.id,
                    first_name=p.first_name,
                    position=None,
                    jersey_number=p.jersey_number,
                    biography=None,
                    photo_url=None,
                    has_full_profile=False,
                    sort_order=p.sort_order,
                )
            )
    return PlayersPublic(data=public_players, count=len(public_players))


@router.get("/matches", response_model=MatchesPublic)
def get_matches(
    session: SessionDep,
    status: str | None = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
) -> Any:
    """List all matches (public)."""
    matches, count = crud.get_matches(
        session=session, status=status, skip=skip, limit=limit
    )
    return MatchesPublic(
        data=[MatchPublic.model_validate(m) for m in matches],
        count=count,
    )


@router.get("/matches/{match_id}", response_model=MatchDetailPublic)
def get_match_detail(session: SessionDep, match_id: uuid.UUID) -> Any:
    """Match detail with updates and media."""
    match = crud.get_match(session=session, match_id=match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    updates = crud.get_match_updates(session=session, match_id=match_id)
    medias = crud.get_match_medias(session=session, match_id=match_id)
    return MatchDetailPublic(
        **MatchPublic.model_validate(match).model_dump(),
        updates=[MatchUpdatePublic.model_validate(u) for u in updates],
        media=[MatchMediaPublic.model_validate(m) for m in medias],
    )


@router.get("/matches/{match_id}/updates", response_model=MatchUpdatesPublic)
def get_match_updates(
    session: SessionDep,
    match_id: uuid.UUID,
    after: datetime | None = None,
) -> Any:
    """Match updates (used for polling)."""
    match = crud.get_match(session=session, match_id=match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    updates = crud.get_match_updates(session=session, match_id=match_id, after=after)
    return MatchUpdatesPublic(
        data=[MatchUpdatePublic.model_validate(u) for u in updates],
        count=len(updates),
    )
