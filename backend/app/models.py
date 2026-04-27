import uuid
from datetime import datetime, timezone
from enum import Enum

from pydantic import EmailStr
from sqlalchemy import Column, DateTime, Index, String
from sqlmodel import Field, Relationship, SQLModel


def get_datetime_utc() -> datetime:
    return datetime.now(timezone.utc)


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore[assignment]
    password: str | None = Field(default=None, min_length=8, max_length=128)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID
    created_at: datetime | None = None


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore[assignment]


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime | None = None


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)


# ── Football School Models ──────────────────────────────────────────────


class TeamContent(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    content: str = Field(sa_column=Column("content", String, nullable=False))
    updated_at: datetime = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    updated_by_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)


class TeamContentUpdate(SQLModel):
    content: str = Field(min_length=1)


class TeamContentPublic(SQLModel):
    content: str
    updated_at: datetime | None = None


# ── Coach ────────────────────────────────────────────────────────────────


class CoachBase(SQLModel):
    name: str = Field(min_length=1, max_length=255)
    role: str = Field(min_length=1, max_length=100)
    biography: str | None = None
    sort_order: int = 0


class Coach(CoachBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    photo_url: str | None = Field(default=None, max_length=500)
    created_at: datetime = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    updated_at: datetime = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )


class CoachCreate(CoachBase):
    pass


class CoachUpdate(SQLModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    role: str | None = Field(default=None, min_length=1, max_length=100)
    biography: str | None = None
    sort_order: int | None = None


class CoachPublic(CoachBase):
    id: uuid.UUID
    photo_url: str | None = None


class CoachesPublic(SQLModel):
    data: list[CoachPublic]
    count: int


# ── Player ───────────────────────────────────────────────────────────────


class PlayerBase(SQLModel):
    name: str = Field(min_length=1, max_length=255)
    first_name: str = Field(min_length=1, max_length=100)
    position: str | None = Field(default=None, max_length=50)
    jersey_number: int | None = Field(default=None, ge=1, le=99)
    biography: str | None = None
    has_parental_consent: bool = False
    sort_order: int = 0


class Player(PlayerBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    photo_url: str | None = Field(default=None, max_length=500)
    created_at: datetime = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    updated_at: datetime = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )


class PlayerCreate(PlayerBase):
    pass


class PlayerUpdate(SQLModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    first_name: str | None = Field(default=None, min_length=1, max_length=100)
    position: str | None = Field(default=None, max_length=50)
    jersey_number: int | None = Field(default=None, ge=1, le=99)
    biography: str | None = None
    has_parental_consent: bool | None = None
    sort_order: int | None = None


class PlayerPublic(SQLModel):
    """Public player — fields filtered based on consent."""

    id: uuid.UUID
    first_name: str
    position: str | None = None
    jersey_number: int | None = None
    biography: str | None = None
    photo_url: str | None = None
    has_full_profile: bool = False
    sort_order: int = 0


class PlayerAdmin(PlayerBase):
    """Admin view — all fields visible."""

    id: uuid.UUID
    photo_url: str | None = None


class PlayersPublic(SQLModel):
    data: list[PlayerPublic]
    count: int


class PlayersAdminPublic(SQLModel):
    data: list[PlayerAdmin]
    count: int


# ── Match ────────────────────────────────────────────────────────────────


class MatchStatus(str, Enum):
    upcoming = "upcoming"
    live = "live"
    completed = "completed"


class MatchBase(SQLModel):
    match_date: datetime = Field(sa_type=DateTime(timezone=True))  # type: ignore
    home_team: str = Field(min_length=1, max_length=255)
    away_team: str = Field(min_length=1, max_length=255)
    precautions: str | None = None
    is_public: bool = Field(default=True, nullable=False)


class Match(MatchBase, table=True):
    __table_args__ = (
        Index("ix_match_status", "status"),
        Index("ix_match_match_date", "match_date"),
    )

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    status: str = Field(default="upcoming", max_length=20)
    home_score: int | None = None
    away_score: int | None = None
    created_at: datetime = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    updated_at: datetime = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    created_by_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)

    updates: list["MatchUpdate"] = Relationship(
        back_populates="match", cascade_delete=True
    )
    media: list["MatchMedia"] = Relationship(
        back_populates="match", cascade_delete=True
    )


class MatchCreate(MatchBase):
    pass


class MatchPatch(SQLModel):
    """PATCH body for updating a match (named to avoid collision with MatchUpdate table)."""

    match_date: datetime | None = Field(default=None, sa_type=DateTime(timezone=True))  # type: ignore
    home_team: str | None = Field(default=None, min_length=1, max_length=255)
    away_team: str | None = Field(default=None, min_length=1, max_length=255)
    precautions: str | None = None
    is_public: bool | None = None
    status: MatchStatus | None = None
    home_score: int | None = None
    away_score: int | None = None


class MatchPublic(MatchBase):
    id: uuid.UUID
    status: str
    home_score: int | None = None
    away_score: int | None = None


class MatchesPublic(SQLModel):
    data: list[MatchPublic]
    count: int


# ── Match Update (live updates) ─────────────────────────────────────────


class MatchUpdate(SQLModel, table=True):
    __table_args__ = (
        Index("ix_matchupdate_match_id_created_at", "match_id", "created_at"),
    )

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    match_id: uuid.UUID = Field(
        foreign_key="match.id", nullable=False, ondelete="CASCADE"
    )
    content: str = Field(min_length=1, max_length=1000)
    created_at: datetime = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )

    match: Match | None = Relationship(back_populates="updates")


class MatchUpdateCreate(SQLModel):
    content: str = Field(min_length=1, max_length=1000)


class MatchUpdatePublic(SQLModel):
    id: uuid.UUID
    content: str
    created_at: datetime


class MatchUpdatesPublic(SQLModel):
    data: list[MatchUpdatePublic]
    count: int


# ── Match Media ──────────────────────────────────────────────────────────


class MediaType(str, Enum):
    photo = "photo"
    video = "video"


class MatchMedia(SQLModel, table=True):
    __table_args__ = (Index("ix_matchmedia_match_id", "match_id"),)

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    match_id: uuid.UUID = Field(
        foreign_key="match.id", nullable=False, ondelete="CASCADE"
    )
    media_type: str = Field(max_length=10)
    file_path: str | None = Field(default=None, max_length=500)
    url: str | None = Field(default=None, max_length=1000)
    caption: str | None = Field(default=None, max_length=500)
    title: str | None = Field(default=None, max_length=255)
    sort_order: int = Field(default=0)
    created_at: datetime = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )

    match: Match | None = Relationship(back_populates="media")


class MatchMediaVideoCreate(SQLModel):
    url: str = Field(min_length=1, max_length=1000)
    title: str | None = Field(default=None, max_length=255)
    caption: str | None = Field(default=None, max_length=500)


class MatchMediaPublic(SQLModel):
    id: uuid.UUID
    media_type: str
    file_path: str | None = None
    url: str | None = None
    caption: str | None = None
    title: str | None = None
    sort_order: int = 0


class MatchMediasPublic(SQLModel):
    data: list[MatchMediaPublic]
    count: int


class MatchDetailPublic(MatchPublic):
    """Match detail including updates and media."""

    updates: list[MatchUpdatePublic] = []
    media: list[MatchMediaPublic] = []


class MatchHighlight(MatchPublic):
    """Match with a limited set of photos for landing-page highlights."""

    photos: list[MatchMediaPublic] = []


class LandingPageData(SQLModel):
    upcoming_matches: list[MatchPublic]
    recent_matches: list[MatchHighlight]
    team_name: str
