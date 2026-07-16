from unittest.mock import patch

import pytest
from django.contrib.admin.sites import AdminSite

from adminita.utils import AlwaysVisibleAdmin, SingletonAdmin
from tests.testapp.models import SampleModel


class DummyRequest:
    pass


@pytest.fixture
def site():
    return AdminSite()


def test_always_visible_admin_permissions(site):
    admin_instance = AlwaysVisibleAdmin(SampleModel, site)
    request = DummyRequest()

    assert admin_instance.has_module_permission(request) is True
    assert admin_instance.has_view_permission(request) is True


@pytest.mark.django_db
def test_singleton_admin_allows_add_when_empty(site):
    admin_instance = SingletonAdmin(SampleModel, site)
    request = DummyRequest()

    assert SampleModel.objects.count() == 0
    assert admin_instance.has_add_permission(request) is True


@pytest.mark.django_db
def test_singleton_admin_blocks_add_when_instance_exists(site):
    SampleModel.objects.create(name="Only one")
    admin_instance = SingletonAdmin(SampleModel, site)
    request = DummyRequest()

    assert admin_instance.has_add_permission(request) is False


@pytest.mark.django_db
def test_singleton_admin_never_allows_delete(site):
    obj = SampleModel.objects.create(name="Protected")
    admin_instance = SingletonAdmin(SampleModel, site)
    request = DummyRequest()

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
