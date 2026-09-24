import warnings


def admin_app_list(request):
    """
    Deprecated: no longer needed and does nothing.

    Adminita's sidebar uses Django's own ``available_apps`` context, and the
    admin index pages already receive ``app_list`` from Django's views, so
    this processor only added work to every admin request. It is kept so
    existing settings that reference it don't break; remove
    ``"adminita.context_processors.admin_app_list"`` from your TEMPLATES
    context_processors.
    """
    warnings.warn(
        "adminita.context_processors.admin_app_list is no longer needed and will be "
        "removed in a future release. Remove it from TEMPLATES context_processors.",
        DeprecationWarning,
        stacklevel=2,
    )
    return {}
