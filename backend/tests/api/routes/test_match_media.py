import io

from fastapi.testclient import TestClient

from app.core.config import settings


def _create_match(
    client: TestClient, headers: dict[str, str], *, is_public: bool = True
) -> str:
    r = client.post(
        f"{settings.API_V1_STR}/matches/",
        headers=headers,
        json={
            "match_date": "2025-03-15T14:00:00",
            "home_team": "鹏飏足球",
            "away_team": "对手队",
            "is_public": is_public,
        },
    )
    assert r.status_code == 201
    return r.json()["id"]


def test_upload_match_photo(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    match_id = _create_match(client, superuser_token_headers)
    fake_image = io.BytesIO(b"\x89PNG\r\n\x1a\n" + b"\x00" * 100)
    r = client.post(
        f"{settings.API_V1_STR}/matches/{match_id}/media/photos",
        headers=superuser_token_headers,
        files={"photo": ("test.png", fake_image, "image/png")},
    )
    assert r.status_code == 201
    data = r.json()
    assert data["media_type"] == "photo"
    assert data["file_path"] is not None


def test_public_match_photo_file_is_served(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    match_id = _create_match(client, superuser_token_headers)
    fake_image = io.BytesIO(b"\x89PNG\r\n\x1a\n" + b"\x00" * 100)
    r = client.post(
        f"{settings.API_V1_STR}/matches/{match_id}/media/photos",
        headers=superuser_token_headers,
        files={"photo": ("test.png", fake_image, "image/png")},
    )
    assert r.status_code == 201
    file_response = client.get(r.json()["file_path"])
    assert file_response.status_code == 200


def test_private_match_photo_file_returns_404(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    match_id = _create_match(client, superuser_token_headers, is_public=False)
    fake_image = io.BytesIO(b"\x89PNG\r\n\x1a\n" + b"\x00" * 100)
    r = client.post(
        f"{settings.API_V1_STR}/matches/{match_id}/media/photos",
        headers=superuser_token_headers,
        files={"photo": ("test.png", fake_image, "image/png")},
    )
    assert r.status_code == 201
    file_response = client.get(r.json()["file_path"])
    assert file_response.status_code == 404


def test_add_match_video_link(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    match_id = _create_match(client, superuser_token_headers)
    r = client.post(
        f"{settings.API_V1_STR}/matches/{match_id}/media/videos",
        headers=superuser_token_headers,
        json={"url": "https://www.bilibili.com/video/BV1234567890", "title": "精彩集锦"},
    )
    assert r.status_code == 201
    data = r.json()
    assert data["media_type"] == "video"
    assert data["url"] == "https://www.bilibili.com/video/BV1234567890"


def test_delete_match_media(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    match_id = _create_match(client, superuser_token_headers)
    r = client.post(
        f"{settings.API_V1_STR}/matches/{match_id}/media/videos",
        headers=superuser_token_headers,
        json={"url": "https://example.com/video", "title": "待删除"},
    )
    media_id = r.json()["id"]
    r = client.delete(
        f"{settings.API_V1_STR}/matches/{match_id}/media/{media_id}",
        headers=superuser_token_headers,
    )
    assert r.status_code == 200


def test_upload_photo_unauthenticated(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    match_id = _create_match(client, superuser_token_headers)
    fake_image = io.BytesIO(b"\x89PNG\r\n\x1a\n" + b"\x00" * 100)
    r = client.post(
        f"{settings.API_V1_STR}/matches/{match_id}/media/photos",
        files={"photo": ("test.png", fake_image, "image/png")},
    )
    assert r.status_code == 401


def test_add_video_invalid_url(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    match_id = _create_match(client, superuser_token_headers)
    r = client.post(
        f"{settings.API_V1_STR}/matches/{match_id}/media/videos",
        headers=superuser_token_headers,
        json={"url": "not-a-url", "title": "无效"},
    )
    assert r.status_code == 422
