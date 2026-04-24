from fastapi.testclient import TestClient

from app.core.config import settings


def test_create_player(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    """Admin can create a player."""
    r = client.post(
        f"{settings.API_V1_STR}/players/",
        headers=superuser_token_headers,
        data={
            "name": "张三",
            "first_name": "三",
            "position": "前锋",
            "jersey_number": "10",
            "has_parental_consent": "true",
        },
    )
    assert r.status_code == 201
    data = r.json()
    assert data["name"] == "张三"
    assert data["has_parental_consent"] is True


def test_list_players_admin(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    """Admin can list all players with full data."""
    r = client.get(
        f"{settings.API_V1_STR}/players/",
        headers=superuser_token_headers,
    )
    assert r.status_code == 200
    data = r.json()
    assert "data" in data


def test_public_players_consent_filter(client: TestClient, superuser_token_headers: dict[str, str]) -> None:
    """Public endpoint filters player data by consent."""
    # Create a non-consented player
    client.post(
        f"{settings.API_V1_STR}/players/",
        headers=superuser_token_headers,
        data={
            "name": "李四",
            "first_name": "四",
            "position": "后卫",
            "jersey_number": "5",
            "biography": "Secret bio",
            "has_parental_consent": "false",
        },
    )
    r = client.get(f"{settings.API_V1_STR}/public/players")
    assert r.status_code == 200
    data = r.json()
    for player in data["data"]:
        if not player["has_full_profile"]:
            assert player["biography"] is None
            assert player["photo_url"] is None


def test_delete_player(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    """Admin can delete a player."""
    r = client.post(
        f"{settings.API_V1_STR}/players/",
        headers=superuser_token_headers,
        data={"name": "待删除", "first_name": "删", "has_parental_consent": "false"},
    )
    player_id = r.json()["id"]
    r = client.delete(
        f"{settings.API_V1_STR}/players/{player_id}",
        headers=superuser_token_headers,
    )
    assert r.status_code == 200


def test_create_player_unauthenticated(client: TestClient) -> None:
    """Unauthenticated request is rejected."""
    r = client.post(
        f"{settings.API_V1_STR}/players/",
        data={"name": "未授权", "first_name": "未", "has_parental_consent": "false"},
    )
    assert r.status_code == 401
