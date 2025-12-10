from django.contrib import admin
from django.urls import path
from . import views

# Customize admin site
admin.site.site_header = "Adminita Demo"
admin.site.site_title = "Adminita Admin Portal"
admin.site.index_title = "Welcome to Adminita"

urlpatterns = [
    path("admin/", admin.site.urls),
]
