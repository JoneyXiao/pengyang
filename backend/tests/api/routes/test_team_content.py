from fastapi.testclient import TestClient

from app.core.config import settings


def test_get_team_content_public(client: TestClient) -> None:
    """Public endpoint returns team content."""
    r = client.get(f"{settings.API_V1_STR}/public/team-content")
    assert r.status_code == 200
    data = r.json()
    assert "content" in data
    assert "updated_at" in data


def test_get_team_content_admin(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    """Admin endpoint returns team content."""
    r = client.get(
        f"{settings.API_V1_STR}/team-content/",
        headers=superuser_token_headers,
    )
    assert r.status_code == 200
    data = r.json()
    assert "content" in data


def test_update_team_content(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    """Admin can update team content."""
    r = client.put(
        f"{settings.API_V1_STR}/team-content/",
        headers=superuser_token_headers,
        json={"content": "<h2>新球队介绍</h2><p>测试内容</p>"},
    )
    assert r.status_code == 200
    data = r.json()
    assert "新球队介绍" in data["content"]


def test_update_team_content_sanitizes_html(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    """HTML with scripts is sanitized."""
    r = client.put(
        f"{settings.API_V1_STR}/team-content/",
        headers=superuser_token_headers,
        json={"content": '<p>Safe</p><script>alert("xss")</script>'},
    )
    assert r.status_code == 200
    data = r.json()
    assert "<script>" not in data["content"]
    assert "Safe" in data["content"]


def test_update_team_content_empty_rejected(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    """Empty content is rejected."""
    r = client.put(
        f"{settings.API_V1_STR}/team-content/",
        headers=superuser_token_headers,
        json={"content": ""},
    )
    assert r.status_code == 422


def test_update_team_content_unauthenticated(client: TestClient) -> None:
    """Unauthenticated request is rejected."""
    r = client.put(
        f"{settings.API_V1_STR}/team-content/",
        json={"content": "<p>Should fail</p>"},
    )
    assert r.status_code == 401
