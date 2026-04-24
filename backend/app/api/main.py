from fastapi import APIRouter

from app.api.routes import (
    coaches,
    items,
    login,
    match_media,
    match_updates,
    matches,
    players,
    private,
    public,
    team_content,
    users,
    utils,
)
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(items.router)
api_router.include_router(public.router)
api_router.include_router(team_content.router)
api_router.include_router(coaches.router)
api_router.include_router(players.router)
api_router.include_router(matches.router)
api_router.include_router(match_updates.router)
api_router.include_router(match_media.router)


if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
