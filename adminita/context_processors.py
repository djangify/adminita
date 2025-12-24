from django.contrib import admin


def admin_app_list(request):
    """
    Provide app_list to all admin templates for sidebar navigation.

    Add to TEMPLATES in settings.py:
        "context_processors": [
            ...
            "adminita.context_processors.admin_app_list",
        ],
    """
    if not request.path.startswith("/admin/"):
        return {}

    if hasattr(request, "user") and request.user.is_staff:
        return {"app_list": admin.site.get_app_list(request)}

    return {}
