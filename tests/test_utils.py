from unittest.mock import patch

import pytest
from django.contrib.admin.sites import AdminSite
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission

from adminita.utils import AlwaysVisibleAdmin, SingletonAdmin
from tests.testapp.models import SampleModel


@pytest.fixture
def site():
    return AdminSite()


@pytest.fixture
def superuser(db):
    return get_user_model().objects.create_superuser(
        username="admin", email="admin@example.com", password="password"
    )


@pytest.fixture
def staff_user(db):
    return get_user_model().objects.create_user(
        username="staff", password="password", is_staff=True
    )


def make_request(rf, user, path="/admin/testapp/samplemodel/"):
    request = rf.get(path)
    request.user = user
    return request


def test_always_visible_admin_module_permission(site, rf, staff_user):
    admin_instance = AlwaysVisibleAdmin(SampleModel, site)
    assert admin_instance.has_module_permission(make_request(rf, staff_user)) is True


def test_always_visible_admin_respects_view_permission(site, rf, staff_user):
    admin_instance = AlwaysVisibleAdmin(SampleModel, site)
    assert admin_instance.has_view_permission(make_request(rf, staff_user)) is False

    staff_user.user_permissions.add(Permission.objects.get(codename="view_samplemodel"))
    staff_user = get_user_model().objects.get(pk=staff_user.pk)  # clear permission cache
    assert admin_instance.has_view_permission(make_request(rf, staff_user)) is True


def test_singleton_admin_allows_add_when_empty(site, rf, superuser):
    admin_instance = SingletonAdmin(SampleModel, site)

    assert SampleModel.objects.count() == 0
    assert admin_instance.has_add_permission(make_request(rf, superuser)) is True


def test_singleton_admin_blocks_add_when_instance_exists(site, rf, superuser):
    SampleModel.objects.create(name="Only one")
    admin_instance = SingletonAdmin(SampleModel, site)

    assert admin_instance.has_add_permission(make_request(rf, superuser)) is False


def test_singleton_admin_respects_add_permission(site, rf, staff_user):
    admin_instance = SingletonAdmin(SampleModel, site)

    assert admin_instance.has_add_permission(make_request(rf, staff_user)) is False


def test_singleton_admin_never_allows_delete(site, rf, superuser):
    obj = SampleModel.objects.create(name="Protected")
    admin_instance = SingletonAdmin(SampleModel, site)
    request = make_request(rf, superuser)

    assert admin_instance.has_delete_permission(request, obj) is False
    assert admin_instance.has_delete_permission(request, None) is False


@pytest.mark.django_db
def test_singleton_admin_changelist_shows_add_form_when_empty(site, rf):
    admin_instance = SingletonAdmin(SampleModel, site)
    request = rf.get("/admin/testapp/samplemodel/")

    with patch(
        "django.contrib.admin.ModelAdmin.changelist_view",
        return_value="standard-changelist",
    ) as mocked_super:
        response = admin_instance.changelist_view(request)

    assert response == "standard-changelist"
    mocked_super.assert_called_once()


@pytest.mark.django_db
def test_singleton_admin_changelist_redirects_to_existing_instance(site, rf):
    obj = SampleModel.objects.create(name="Redirect me")
    admin_instance = SingletonAdmin(SampleModel, site)
    request = rf.get("/admin/testapp/samplemodel/")

    fake_url = f"/admin/testapp/samplemodel/{obj.pk}/change/"
    with patch("django.urls.reverse", return_value=fake_url):
        response = admin_instance.changelist_view(request)

    assert response.status_code == 302
    assert response.url == fake_url
