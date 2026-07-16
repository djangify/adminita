from types import SimpleNamespace

import pytest
from django.contrib.auth import get_user_model

from adminita.context_processors import admin_app_list


def test_returns_empty_dict_outside_admin(rf):
    request = rf.get("/not-admin/")
    request.user = SimpleNamespace(is_staff=True)
    assert admin_app_list(request) == {}


def test_returns_empty_dict_for_non_staff_user(rf):
    request = rf.get("/admin/")
    request.user = SimpleNamespace(is_staff=False)
    assert admin_app_list(request) == {}


@pytest.mark.django_db
def test_returns_app_list_for_staff_user(rf):
    user = get_user_model().objects.create_superuser(
        username="admin", email="admin@example.com", password="password"
    )
    request = rf.get("/admin/")
    request.user = user
    result = admin_app_list(request)
    assert "app_list" in result
    assert isinstance(result["app_list"], list)
