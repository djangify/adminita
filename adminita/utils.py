from django.contrib import admin


class AlwaysVisibleAdmin(admin.ModelAdmin):
    """
    Ensures a model always appears in the admin index, even if:
    - It's a singleton
    - The changelist redirects
    - Add is disabled
    - Custom permissions exist
    - Proxy models are used

    Viewing and editing still follow Django's normal model permissions.

    Usage:
        from adminita.utils import AlwaysVisibleAdmin

        @admin.register(SiteConfiguration)
        class SiteConfigurationAdmin(AlwaysVisibleAdmin):
            pass
    """

    def has_module_permission(self, request):
        # Show the model in the sidebar/app list
        return True


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
        # Respect Django's add permission, and prevent adding once an instance exists
        return super().has_add_permission(request) and not self.model.objects.exists()

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
                f"admin:{self.model._meta.app_label}_{self.model._meta.model_name}_change",
                args=[obj.pk],
            )
            return redirect(url)
        # Otherwise show the standard changelist (with Add button)
        return super().changelist_view(request, extra_context=extra_context)
