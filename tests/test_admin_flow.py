import pytest
from django.contrib.auth import get_user_model

pytestmark = pytest.mark.django_db


def test_login_page_renders_adminita_template(client):
    response = client.get("/admin/login/")
    assert response.status_code == 200
    assert "adminita" in response.templates[0].origin.name


def test_superuser_login_reaches_adminita_index(client):
    get_user_model().objects.create_superuser("admin", "admin@example.com", "pw-12345-test")
    response = client.post(
        "/admin/login/",
        {"username": "admin", "password": "pw-12345-test", "next": "/admin/"},
        follow=True,
    )
    assert response.status_code == 200
    assert any("adminita" in t.origin.name for t in response.templates if t.origin)
