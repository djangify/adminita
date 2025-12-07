from django.contrib import admin
from django.urls import path
import views


# Customize admin site
admin.site.site_header = "Adminita Demo"
admin.site.site_title = "Adminita Portal"
admin.site.index_title = "Welcome to Adminita - A Django Tailwind Admin Dashboard"

urlpatterns = [
    path("", views.home, name="home"),
    path("admin/", admin.site.urls),
]
