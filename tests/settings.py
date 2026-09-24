"""
Settings used only for running the test suite.

Extends the demo project's settings and adds a throwaway app with a single
model so the admin utility classes (AlwaysVisibleAdmin, SingletonAdmin) can
be exercised against something concrete.
"""

from config.settings import *  # noqa: F401,F403

INSTALLED_APPS = list(INSTALLED_APPS) + ["tests.testapp"]  # noqa: F405

SECRET_KEY = "test-secret-key-not-for-production"
DEBUG = False

# Tests render templates without running collectstatic, so skip the manifest storage.
STORAGES = {
    **STORAGES,  # noqa: F405
    "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
}
