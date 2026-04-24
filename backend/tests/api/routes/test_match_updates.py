from fastapi.testclient import TestClient

from app.core.config import settings


def _create_match(client: TestClient, headers: dict[str, str]) -> str:
    r = client.post(
        f"{settings.API_V1_STR}/matches/",
        headers=headers,
        json={
            "match_date": "2025-03-15T14:00:00",
            "home_team": "鹏飏足球",
            "away_team": "对手队",
        },
    )
    assert r.status_code == 201
    return r.json()["id"]


def test_create_match_update(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    match_id = _create_match(client, superuser_token_headers)
    r = client.post(
        f"{settings.API_V1_STR}/matches/{match_id}/updates",
        headers=superuser_token_headers,
        json={"content": "比赛开始！"},
    )
    assert r.status_code == 201
    data = r.json()
    assert data["content"] == "比赛开始！"
    assert "created_at" in data


def test_delete_match_update(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    match_id = _create_match(client, superuser_token_headers)
    r = client.post(
        f"{settings.API_V1_STR}/matches/{match_id}/updates",
        headers=superuser_token_headers,
        json={"content": "待删除动态"},
    )
    update_id = r.json()["id"]
    r = client.delete(
        f"{settings.API_V1_STR}/matches/{match_id}/updates/{update_id}",
        headers=superuser_token_headers,
    )
    assert r.status_code == 200


def test_public_match_updates(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    match_id = _create_match(client, superuser_token_headers)
    client.post(
        f"{settings.API_V1_STR}/matches/{match_id}/updates",
        headers=superuser_token_headers,
        json={"content": "第一条动态"},
    )
    r = client.get(f"{settings.API_V1_STR}/public/matches/{match_id}/updates")
    assert r.status_code == 200
    data = r.json()
    assert "data" in data
    assert len(data["data"]) >= 1


def test_create_update_unauthenticated(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    match_id = _create_match(client, superuser_token_headers)
    r = client.post(
        f"{settings.API_V1_STR}/matches/{match_id}/updates",
        json={"content": "未授权"},
    )
    assert r.status_code == 401
