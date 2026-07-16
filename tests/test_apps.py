from django.apps import apps

from adminita.apps import AdminitaConfig


def test_adminita_app_config():
    assert AdminitaConfig.name == "adminita"
    assert AdminitaConfig.verbose_name == "Adminita"
    assert AdminitaConfig.default_auto_field == "django.db.models.BigAutoField"


def test_adminita_app_is_registered():
    config = apps.get_app_config("adminita")
    assert isinstance(config, AdminitaConfig)
