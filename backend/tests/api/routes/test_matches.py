from fastapi.testclient import TestClient

from app.core.config import settings


def _create_match(
    client: TestClient,
    headers: dict[str, str],
    *,
    match_date: str = "2025-03-15T14:00:00",
    away_team: str = "对手队",
    is_public: bool | None = True,
) -> dict:
    payload = {
        "match_date": match_date,
        "home_team": "鹏飏足球",
        "away_team": away_team,
    }
    if is_public is not None:
        payload["is_public"] = is_public

    r = client.post(
        f"{settings.API_V1_STR}/matches/",
        headers=headers,
        json=payload,
    )
    assert r.status_code == 201
    return r.json()


def test_create_match(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = _create_match(client, superuser_token_headers)
    assert data["home_team"] == "鹏飏足球"
    assert data["status"] == "upcoming"
    assert data["is_public"] is True


def test_create_match_defaults_to_public_when_visibility_omitted(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = _create_match(client, superuser_token_headers, is_public=None)
    assert data["is_public"] is True


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


def test_update_match_visibility(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    match = _create_match(client, superuser_token_headers)
    r = client.patch(
        f"{settings.API_V1_STR}/matches/{match['id']}",
        headers=superuser_token_headers,
        json={"is_public": False},
    )
    assert r.status_code == 200
    assert r.json()["is_public"] is False


def test_admin_list_includes_private_matches(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    match = _create_match(
        client,
        superuser_token_headers,
        match_date="2035-03-15T14:00:00",
        away_team="隐私测试队",
        is_public=False,
    )
    r = client.get(
        f"{settings.API_V1_STR}/matches/",
        headers=superuser_token_headers,
    )
    assert r.status_code == 200
    assert any(m["id"] == match["id"] for m in r.json()["data"])


def test_public_match_list_excludes_private_matches(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    private_match = _create_match(
        client,
        superuser_token_headers,
        match_date="2035-03-15T14:00:00",
        away_team="不公开列表测试队",
        is_public=False,
    )
    r = client.get(f"{settings.API_V1_STR}/public/matches?status=upcoming")
    assert r.status_code == 200
    assert all(m["id"] != private_match["id"] for m in r.json()["data"])


def test_public_landing_excludes_private_matches(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    private_match = _create_match(
        client,
        superuser_token_headers,
        match_date="2035-03-15T14:00:00",
        away_team="不公开首页测试队",
        is_public=False,
    )
    r = client.get(f"{settings.API_V1_STR}/public/landing")
    assert r.status_code == 200
    data = r.json()
    assert all(m["id"] != private_match["id"] for m in data["upcoming_matches"])


def test_public_match_detail_returns_404_for_private_match(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    private_match = _create_match(
        client,
        superuser_token_headers,
        away_team="不公开详情测试队",
        is_public=False,
    )
    r = client.get(f"{settings.API_V1_STR}/public/matches/{private_match['id']}")
    assert r.status_code == 404


def test_admin_match_detail_returns_private_match(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    private_match = _create_match(
        client,
        superuser_token_headers,
        away_team="后台详情测试队",
        is_public=False,
    )
    r = client.get(
        f"{settings.API_V1_STR}/matches/{private_match['id']}",
        headers=superuser_token_headers,
    )
    assert r.status_code == 200
    data = r.json()
    assert data["id"] == private_match["id"]
    assert data["is_public"] is False
    assert "updates" in data
    assert "media" in data


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
