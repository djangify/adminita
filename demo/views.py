from django.shortcuts import render


def home(request):
    """
    Landing page for Adminita demo site
    """
    context = {
        "features": [
            {
                "icon": "palette",
                "title": "Modern Design",
                "description": "Beautiful, clean interface built with Tailwind CSS v4 for a contemporary look and feel.",
            },
            {
                "icon": "moon",
                "title": "Dark Mode",
                "description": "Built-in dark mode support that respects user preferences and provides a comfortable viewing experience.",
            },
            {
                "icon": "mobile",
                "title": "Fully Responsive",
                "description": "Works perfectly on all devices - from mobile phones to desktop screens.",
            },
            {
                "icon": "zap",
                "title": "Easy Installation",
                "description": "Simple pip install and you're ready to go. Just add to INSTALLED_APPS.",
            },
            {
                "icon": "customize",
                "title": "Customizable",
                "description": "Easy to customize colors and styling using Tailwind CSS theme configuration.",
            },
            {
                "icon": "django",
                "title": "Django Native",
                "description": "Built specifically for Django admin, no external dependencies required.",
            },
        ]
    }
    return render(request, "demo/home.html", context)
