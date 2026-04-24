from fastapi.testclient import TestClient

from app.core.config import settings


def test_create_coach(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    """Admin can create a coach."""
    r = client.post(
        f"{settings.API_V1_STR}/coaches/",
        headers=superuser_token_headers,
        data={"name": "张教练", "role": "主教练", "biography": "资深教练"},
    )
    assert r.status_code == 201
    data = r.json()
    assert data["name"] == "张教练"
    assert data["role"] == "主教练"


def test_list_coaches(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    """Admin can list coaches."""
    r = client.get(
        f"{settings.API_V1_STR}/coaches/",
        headers=superuser_token_headers,
    )
    assert r.status_code == 200
    data = r.json()
    assert "data" in data
    assert "count" in data


def test_delete_coach(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    """Admin can delete a coach."""
    # Create first
    r = client.post(
        f"{settings.API_V1_STR}/coaches/",
        headers=superuser_token_headers,
        data={"name": "待删除教练", "role": "助理教练"},
    )
    coach_id = r.json()["id"]
    # Delete
    r = client.delete(
        f"{settings.API_V1_STR}/coaches/{coach_id}",
        headers=superuser_token_headers,
    )
    assert r.status_code == 200


def test_delete_coach_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    """Deleting non-existent coach returns 404."""
    r = client.delete(
        f"{settings.API_V1_STR}/coaches/00000000-0000-0000-0000-000000000000",
        headers=superuser_token_headers,
    )
    assert r.status_code == 404


def test_create_coach_unauthenticated(client: TestClient) -> None:
    """Unauthenticated request is rejected."""
    r = client.post(
        f"{settings.API_V1_STR}/coaches/",
        data={"name": "未授权", "role": "教练"},
    )
    assert r.status_code == 401


def test_public_coaches(client: TestClient) -> None:
    """Public endpoint lists coaches."""
    r = client.get(f"{settings.API_V1_STR}/public/coaches")
    assert r.status_code == 200
    data = r.json()
    assert "data" in data
    assert "count" in data
