import os

from app.config import get_settings

# Las pruebas corren contra TEST_DATABASE_URL, nunca contra la base de desarrollo.
_settings = get_settings()
if not _settings.test_database_url:
    raise RuntimeError("Falta TEST_DATABASE_URL en el .env (ver .env.example)")
if _settings.test_database_url == _settings.database_url:
    raise RuntimeError(
        "TEST_DATABASE_URL no puede ser igual a DATABASE_URL: las pruebas borran datos"
    )
os.environ["DATABASE_URL"] = _settings.test_database_url
get_settings.cache_clear()

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.main import create_app  # noqa: E402


@pytest.fixture
def client() -> TestClient:
    return TestClient(create_app())
