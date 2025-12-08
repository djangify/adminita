from django.shortcuts import render


def home(request):
    """Landing page for Adminita"""
    features = [
        {
            "icon": "palette",
            "title": "Modern Design",
            "description": "Beautiful, clean interface built with Tailwind CSS v4.",
        },
        {
            "icon": "moon",
            "title": "Dark Mode",
            "description": "Built-in dark mode support that respects user preferences.",
        },
        {
            "icon": "mobile",
            "title": "Fully Responsive",
            "description": "Works perfectly on all devices.",
        },
        {
            "icon": "zap",
            "title": "Easy Installation",
            "description": "Simple pip install and add to INSTALLED_APPS.",
        },
        {
            "icon": "customize",
            "title": "Customizable",
            "description": "Easy to customize using Tailwind CSS.",
        },
        {
            "icon": "django",
            "title": "Django Native",
            "description": "Built specifically for Django admin.",
        },
    ]
    return render(request, "home.html", {"features": features})
