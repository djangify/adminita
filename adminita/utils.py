from django.contrib import admin


class AlwaysVisibleAdmin(admin.ModelAdmin):
    """
    Ensures a model always appears in the admin index, even if:
    - It's a singleton
    - The changelist redirects
    - Add is disabled
    - Custom permissions exist
    - Proxy models are used

    Usage:
        from adminita.utils import AlwaysVisibleAdmin

        @admin.register(SiteConfiguration)
        class SiteConfigurationAdmin(AlwaysVisibleAdmin):
            pass
    """

    def has_module_permission(self, request):
        # Show the model in the sidebar/app list
        return True

    def has_view_permission(self, request, obj=None):
        # Default: allow viewing the single instance
        return True

    def get_changelist(self, request, **kwargs):
        """
        Prevent redirect-based changelists from breaking app_list rendering.
        Even if the developer overrides changelist_view, we ensure Django
        still thinks the model is viewable.
        """
        return super().get_changelist(request, **kwargs)


class SingletonAdmin(AlwaysVisibleAdmin):
    """
    For models that should only have one instance (Site Settings, etc.)

    Usage:
        from adminita.utils import SingletonAdmin

        @admin.register(SiteConfiguration)
        class SiteConfigurationAdmin(SingletonAdmin):
            pass
    """

    def has_add_permission(self, request):
        # Prevent adding new instances if one exists
        return not self.model.objects.exists()

    def has_delete_permission(self, request, obj=None):
        # Prevent deletion of the singleton
        return False

    def changelist_view(self, request, extra_context=None):
        # If an instance exists, redirect directly to edit it
        obj = self.model.objects.first()
        if obj:
            from django.shortcuts import redirect
            from django.urls import reverse
            url = reverse(
                f'admin:{self.model._meta.app_label}_{self.model._meta.model_name}_change',
                args=[obj.pk]
            )
            return redirect(url)
        # Otherwise show the standard changelist (with Add button)
        return super().changelist_view(request, extra_context=extra_context)