from fastapi.testclient import TestClient

from app.core.config import settings


def _create_match(
    client: TestClient, headers: dict[str, str]
) -> dict:
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
    return r.json()


def test_create_match(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = _create_match(client, superuser_token_headers)
    assert data["home_team"] == "鹏飏足球"
    assert data["status"] == "upcoming"


def test_list_matches(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    _create_match(client, superuser_token_headers)
    r = client.get(
        f"{settings.API_V1_STR}/matches/",
        headers=superuser_token_headers,
    )
    assert r.status_code == 200
    data = r.json()
    assert "data" in data
    assert data["count"] >= 1


def test_list_matches_filter_status(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    _create_match(client, superuser_token_headers)
    r = client.get(
        f"{settings.API_V1_STR}/matches/?status=upcoming",
        headers=superuser_token_headers,
    )
    assert r.status_code == 200
    for m in r.json()["data"]:
        assert m["status"] == "upcoming"


def test_update_match_status(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    match = _create_match(client, superuser_token_headers)
    r = client.patch(
        f"{settings.API_V1_STR}/matches/{match['id']}",
        headers=superuser_token_headers,
        json={"status": "live"},
    )
    assert r.status_code == 200
    assert r.json()["status"] == "live"


def test_update_match_score(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    match = _create_match(client, superuser_token_headers)
    r = client.patch(
        f"{settings.API_V1_STR}/matches/{match['id']}",
        headers=superuser_token_headers,
        json={"home_score": 2, "away_score": 1},
    )
    assert r.status_code == 200
    data = r.json()
    assert data["home_score"] == 2
    assert data["away_score"] == 1


def test_delete_match(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    match = _create_match(client, superuser_token_headers)
    r = client.delete(
        f"{settings.API_V1_STR}/matches/{match['id']}",
        headers=superuser_token_headers,
    )
    assert r.status_code == 200


def test_delete_match_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    r = client.delete(
        f"{settings.API_V1_STR}/matches/00000000-0000-0000-0000-000000000000",
        headers=superuser_token_headers,
    )
    assert r.status_code == 404


def test_create_match_unauthenticated(client: TestClient) -> None:
    r = client.post(
        f"{settings.API_V1_STR}/matches/",
        json={
            "match_date": "2025-03-15T14:00:00",
            "home_team": "鹏飏足球",
            "away_team": "对手队",
        },
    )
    assert r.status_code == 401
