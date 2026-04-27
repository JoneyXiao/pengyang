import uuid
from datetime import datetime
from typing import Any

from sqlmodel import Session, col, select

from app.core.security import get_password_hash, verify_password
from app.models import (
    Coach,
    CoachCreate,
    CoachUpdate,
    Item,
    ItemCreate,
    Match,
    MatchCreate,
    MatchMedia,
    MatchMediaVideoCreate,
    MatchPatch,
    MatchUpdate,
    MatchUpdateCreate,
    Player,
    PlayerCreate,
    PlayerUpdate,
    TeamContent,
    TeamContentUpdate,
    User,
    UserCreate,
    UserUpdate,
    get_datetime_utc,
)


def create_user(*, session: Session, user_create: UserCreate) -> User:
    db_obj = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> Any:
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}
    if "password" in user_data:
        password = user_data["password"]
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


# Dummy hash to use for timing attack prevention when user is not found
# This is an Argon2 hash of a random password, used to ensure constant-time comparison
DUMMY_HASH = "$argon2id$v=19$m=65536,t=3,p=4$MjQyZWE1MzBjYjJlZTI0Yw$YTU4NGM5ZTZmYjE2NzZlZjY0ZWY3ZGRkY2U2OWFjNjk"


def authenticate(*, session: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        # Prevent timing attacks by running password verification even when user doesn't exist
        # This ensures the response time is similar whether or not the email exists
        verify_password(password, DUMMY_HASH)
        return None
    verified, updated_password_hash = verify_password(password, db_user.hashed_password)
    if not verified:
        return None
    if updated_password_hash:
        db_user.hashed_password = updated_password_hash
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
    return db_user


def create_item(*, session: Session, item_in: ItemCreate, owner_id: uuid.UUID) -> Item:
    db_item = Item.model_validate(item_in, update={"owner_id": owner_id})
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


# ── TeamContent ──────────────────────────────────────────────────────────


def get_team_content(*, session: Session) -> TeamContent | None:
    return session.exec(select(TeamContent)).first()


def update_team_content(
    *, session: Session, content_in: TeamContentUpdate, updated_by_id: uuid.UUID
) -> TeamContent:
    tc = get_team_content(session=session)
    if not tc:
        tc = TeamContent(
            content=content_in.content,
            updated_by_id=updated_by_id,
        )
    else:
        tc.content = content_in.content
        tc.updated_by_id = updated_by_id
        tc.updated_at = get_datetime_utc()
    session.add(tc)
    session.commit()
    session.refresh(tc)
    return tc


# ── Coach ────────────────────────────────────────────────────────────────


def create_coach(
    *, session: Session, coach_in: CoachCreate, photo_url: str | None = None
) -> Coach:
    db_coach = Coach.model_validate(coach_in, update={"photo_url": photo_url})
    session.add(db_coach)
    session.commit()
    session.refresh(db_coach)
    return db_coach


def get_coaches(*, session: Session) -> list[Coach]:
    return list(session.exec(select(Coach).order_by(Coach.sort_order)).all())


def get_coach(*, session: Session, coach_id: uuid.UUID) -> Coach | None:
    return session.get(Coach, coach_id)


def update_coach(
    *,
    session: Session,
    db_coach: Coach,
    coach_in: CoachUpdate,
    photo_url: str | None = None,
) -> Coach:
    update_data = coach_in.model_dump(exclude_unset=True)
    if photo_url is not None:
        update_data["photo_url"] = photo_url
    db_coach.sqlmodel_update(update_data)
    db_coach.updated_at = get_datetime_utc()
    session.add(db_coach)
    session.commit()
    session.refresh(db_coach)
    return db_coach


def delete_coach(*, session: Session, db_coach: Coach) -> None:
    session.delete(db_coach)
    session.commit()


# ── Player ───────────────────────────────────────────────────────────────


def create_player(
    *, session: Session, player_in: PlayerCreate, photo_url: str | None = None
) -> Player:
    db_player = Player.model_validate(player_in, update={"photo_url": photo_url})
    session.add(db_player)
    session.commit()
    session.refresh(db_player)
    return db_player


def get_players(*, session: Session) -> list[Player]:
    return list(session.exec(select(Player).order_by(Player.sort_order)).all())


def get_player(*, session: Session, player_id: uuid.UUID) -> Player | None:
    return session.get(Player, player_id)


def update_player(
    *,
    session: Session,
    db_player: Player,
    player_in: PlayerUpdate,
    photo_url: str | None = None,
) -> Player:
    update_data = player_in.model_dump(exclude_unset=True)
    if photo_url is not None:
        update_data["photo_url"] = photo_url
    db_player.sqlmodel_update(update_data)
    db_player.updated_at = get_datetime_utc()
    session.add(db_player)
    session.commit()
    session.refresh(db_player)
    return db_player


def delete_player(*, session: Session, db_player: Player) -> None:
    session.delete(db_player)
    session.commit()


# ── Match ────────────────────────────────────────────────────────────────


def create_match(
    *, session: Session, match_in: MatchCreate, created_by_id: uuid.UUID
) -> Match:
    db_match = Match.model_validate(match_in, update={"created_by_id": created_by_id})
    session.add(db_match)
    session.commit()
    session.refresh(db_match)
    return db_match


def get_matches(
    *,
    session: Session,
    status: str | None = None,
    public_only: bool = False,
    skip: int = 0,
    limit: int = 20,
) -> tuple[list[Match], int]:
    stmt = select(Match)
    if status:
        stmt = stmt.where(Match.status == status)
    if public_only:
        stmt = stmt.where(Match.is_public)
    count_stmt = stmt
    count = len(list(session.exec(count_stmt).all()))
    stmt = stmt.order_by(col(Match.match_date).desc()).offset(skip).limit(limit)
    return list(session.exec(stmt).all()), count


def get_match(*, session: Session, match_id: uuid.UUID) -> Match | None:
    return session.get(Match, match_id)


def update_match(
    *, session: Session, db_match: Match, match_in: MatchPatch
) -> Match:
    update_data = match_in.model_dump(exclude_unset=True)
    db_match.sqlmodel_update(update_data)
    db_match.updated_at = get_datetime_utc()
    session.add(db_match)
    session.commit()
    session.refresh(db_match)
    return db_match


def delete_match(*, session: Session, db_match: Match) -> None:
    session.delete(db_match)
    session.commit()


# ── MatchUpdate ──────────────────────────────────────────────────────────


def create_match_update(
    *, session: Session, match_id: uuid.UUID, update_in: MatchUpdateCreate
) -> MatchUpdate:
    db_update = MatchUpdate(match_id=match_id, content=update_in.content)
    session.add(db_update)
    session.commit()
    session.refresh(db_update)
    return db_update


def get_match_updates(
    *,
    session: Session,
    match_id: uuid.UUID,
    after: datetime | None = None,
) -> list[MatchUpdate]:
    stmt = select(MatchUpdate).where(MatchUpdate.match_id == match_id)
    if after:
        stmt = stmt.where(MatchUpdate.created_at > after)
    stmt = stmt.order_by(MatchUpdate.created_at)
    return list(session.exec(stmt).all())


def get_match_update(
    *, session: Session, update_id: uuid.UUID
) -> MatchUpdate | None:
    return session.get(MatchUpdate, update_id)


def delete_match_update(*, session: Session, db_update: MatchUpdate) -> None:
    session.delete(db_update)
    session.commit()


# ── MatchMedia ───────────────────────────────────────────────────────────


def create_match_media_photo(
    *,
    session: Session,
    match_id: uuid.UUID,
    file_path: str,
    caption: str | None = None,
) -> MatchMedia:
    db_media = MatchMedia(
        match_id=match_id,
        media_type="photo",
        file_path=file_path,
        caption=caption,
    )
    session.add(db_media)
    session.commit()
    session.refresh(db_media)
    return db_media


def create_match_media_video(
    *, session: Session, match_id: uuid.UUID, video_in: MatchMediaVideoCreate
) -> MatchMedia:
    db_media = MatchMedia(
        match_id=match_id,
        media_type="video",
        url=video_in.url,
        title=video_in.title,
        caption=video_in.caption,
    )
    session.add(db_media)
    session.commit()
    session.refresh(db_media)
    return db_media


def get_match_media(*, session: Session, media_id: uuid.UUID) -> MatchMedia | None:
    return session.get(MatchMedia, media_id)


def get_match_medias(*, session: Session, match_id: uuid.UUID) -> list[MatchMedia]:
    stmt = (
        select(MatchMedia)
        .where(MatchMedia.match_id == match_id)
        .order_by(MatchMedia.sort_order)
    )
    return list(session.exec(stmt).all())


def get_match_photos(
    *, session: Session, match_id: uuid.UUID, limit: int = 10
) -> list[MatchMedia]:
    stmt = (
        select(MatchMedia)
        .where(MatchMedia.match_id == match_id, MatchMedia.media_type == "photo")
        .order_by(MatchMedia.sort_order)
        .limit(limit)
    )
    return list(session.exec(stmt).all())


def delete_match_media(*, session: Session, db_media: MatchMedia) -> None:
    session.delete(db_media)
    session.commit()
