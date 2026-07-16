![adminita header](https://github.com/djangify/adminita/blob/336735abb0e7679f4e2622615f891d178fd4bab3/adminita-homepage.png)


# Adminita

A modern, beautiful Django admin theme built with Tailwind CSS v4. Transform your Django admin interface into a sleek, responsive dashboard with dark mode support.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![Django](https://img.shields.io/badge/django-4.2+-green.svg)
![Tailwind CSS](https://img.shields.io/badge/tailwind-v4-38bdf8.svg)
![PyPI](https://img.shields.io/pypi/v/adminita.svg)

## ✨ Features

- 🎨 **Modern UI** - Clean, professional interface built with Tailwind CSS v4
- 🌓 **Dark Mode** - System preference detection with manual toggle
- 📱 **Responsive Design** - Works seamlessly on desktop. Responsive navigation and touch-friendly controls for phones and tablets
- 🎯 **Easy Integration** - Drop-in replacement for Django's default admin
- ⚡ **Fast** - Optimized CSS with no unnecessary bloat
- 🔧 **Customizable** - Easy to customize colors and styling
- 🆓 **Open Source** - MIT licensed, free to use and modify

## 📸 Screenshots

### Light Mode

![adminita light dashboard](https://github.com/djangify/adminita/blob/ac1e111dcf7ffae28dcdca60a78dbf32c848d035/adminita-lightdashboard.png)

### Dark Mode
![Dark Mode Dashboard](https://github.com/djangify/adminita/blob/93e527055807d5e6e05b2fa5724f97835ee53232/adminita-dark-mode.png)

## 🚀 Quick Start

### Installation

1. **Install via pip** (recommended for production):

```bash
pip install adminita
```

2. **Or install from source** (for development):

```bash
git clone https://github.com/djangify/adminita.git
cd adminita
pip install -e .
```

### Configuration

1. **Add to INSTALLED_APPS** in your Django settings (must be before `django.contrib.admin`):

```python
INSTALLED_APPS = [
    "adminita",  # Must be FIRST!
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # ... your other apps
]
```

2. **Configure static files**:

```python
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
```

3. **Add customization to project urls.py file**:
Adminita uses Django's built-in admin site customization. Add these lines to your `urls.py`:
```python
from django.contrib import admin

admin.site.site_header = "Your Site Name"
admin.site.site_title = "Your Site Title" 
admin.site.index_title = "Welcome to Your Site"
```

4. **Collect static files**:

```bash
python manage.py collectstatic --noinput
```

5. **Run your server**:

```bash
python manage.py runserver
```

6. **Visit the admin** at `http://localhost:8000/admin/`

That's it! Your Django admin should now have the Adminita theme applied.

## 🎨 Customization

### Changing Colors

Adminita uses Tailwind CSS v4's new `@theme` syntax. To customize colors:

1. **Edit the source CSS** at `adminita/static/src/input.css`:

```css
@theme {
  /* Change primary colors to match your brand */
  --color-primary-500: #10b981; /* Your brand color */
  --color-primary-600: #059669; /* Darker shade */
  --color-primary-700: #047857; /* Even darker */
}
```

2. **Rebuild the CSS**:

```bash
cd path/to/adminita
npm install  # If you haven't already
npm run build
```

3. **Collect static files** in your project:

```bash
python manage.py collectstatic --noinput
```

### Available Color Variables

```css
--color-primary-50 through --color-primary-950
--color-gray-50 through --color-gray-900
--color-gray-750 (custom for dark mode)
```
## 🔧 Utility Classes

Adminita provides utility classes to help with common admin patterns.

### AlwaysVisibleAdmin

Ensures models always appear in the admin index, even if they have custom permissions:
```python
from adminita.utils import AlwaysVisibleAdmin

@admin.register(MyModel)
class MyModelAdmin(AlwaysVisibleAdmin):
    pass
```

### SingletonAdmin

For models that should only have one instance (like Site Settings):
```python
from adminita.utils import SingletonAdmin

@admin.register(SiteConfiguration)
class SiteConfigurationAdmin(SingletonAdmin):
    list_display = ['site_name']
```

## 🛠️ Development

### Setting Up Development Environment

1. **Clone the repository**:

```bash
git clone https://github.com/djangify/adminita.git
cd adminita
```

2. **Create a virtual environment**:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**:

```bash
pip install -r requirements.txt
npm install
```

4. **Build CSS**:

```bash
npm run build    # One-time build
npm run watch    # Auto-rebuild on changes
```

5. **Run the demo project**:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Project Structure

```
adminita/
├── adminita/                  # The Django app package
│   ├── static/
│   │   ├── css/
│   │   │   └── adminita-tailwind.css    # Generated CSS (don't edit)
│   │   ├── js/
│   │   │   └── adminita-tailwind.js      # JavaScript for dark mode & mobile menu
│   │   └── src/
│   │       └── input.css     # Source CSS with Tailwind v4 syntax
│   ├── templates/
│   │   └── admin/            # Template overrides
│   │       ├── base.html
│   │       ├── base_site.html
│   │       ├── index.html
│   │       ├── login.html
│   │       ├── change_list.html
│   │       └── change_form.html
│   ├── __init__.py
│   └── apps.py
├── config/                    # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py
├── package.json              # Node.js dependencies for Tailwind
├── pyproject.toml            # Python package configuration
└── README.md
```

## 🐛 Known Issues

## Issue: Search and filters break after zero-result state

### Symptoms
- Search returns correct results
- Filters work initially
- After any action that returns zero results, filters stop working
- JavaScript error: `undefined is not iterable` in actions.js

### Root cause
Django's admin/js/actions.js expects specific DOM elements that may not exist 
when the result set is empty, causing a JavaScript crash that breaks subsequent 
page functionality.

### Workaround
Disable admin actions or add error handling for the zero-result state.

## Known Limitations
These changes make Adminita usable on mobile, not optimized for mobile:

- Complex tables - Very wide tables still require horizontal scrolling
- Inline formsets - Tabular inlines are cramped; consider using stacked inlines for mobile-heavy use cases
- Rich text editors - TinyMCE and similar may have their own mobile issues
- Date/time pickers - Django's default widgets are desktop-focused

## Future Improvements (Community PRs Welcome)

 - Card-based table view option for mobile (instead of horizontal scroll)
 - Bottom navigation bar for common actions
 - Pull-to-refresh on list pages
 - Improved inline formset mobile layout
 - Native date/time inputs on mobile (<input type="date">)

## 📚 Documentation

### Tailwind CSS v4 Notes

Adminita uses Tailwind CSS v4, which has a different syntax than v3:

- Uses `@import "tailwindcss"` instead of `@tailwind` directives
- Theme customization uses `@theme {}` blocks in CSS
- More streamlined, CSS-first approach

### Template Inheritance

When extending Adminita templates in your own project:

```django
{% extends "admin/base.html" %}
```

**Not** `adminita/admin/base.html` - Django finds templates automatically because `adminita` is in `INSTALLED_APPS`.

## 🤝 Contributing

We welcome contributions! Adminita is an open-source project and we'd love your help making it better. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide (setup, coding standards, PR process) and our [Code of Conduct](CODE_OF_CONDUCT.md).

### Priority Issues

We especially need help with:

- 📱 **Mobile Responsiveness** - Testing on various devices
- ♿ **Accessibility** - ARIA labels, keyboard navigation, screen reader support
- 🎨 **Additional Themes** - Creating alternative color schemes
- 🧪 **Test Coverage** - Expanding the test suite
- 📝 **Documentation** - Improving guides and examples

## 📦 Requirements

- Python 3.10+
- Django 4.2+
- Node.js (for building CSS during development)
- npm (for managing Tailwind CSS)

## 🧪 Testing

```bash
# Run the test suite
pytest

# Or via Django's test runner
python manage.py test
```

Tests run automatically on every pull request via GitHub Actions across supported Python/Django versions. Manual checks worth doing before submitting a PR: multiple browsers (Chrome, Firefox, Safari, Edge), dark mode toggle, and responsive layout on mobile.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- Built with [Django](https://www.djangoproject.com/)
- Styled with [Tailwind CSS v4](https://tailwindcss.com/)
- Inspired by modern admin dashboards

## 🔗 Links

- **GitHub**: https://github.com/djangify/adminita
- **Issues**: https://github.com/djangify/adminita/issues
- **PyPI**: https://pypi.org/project/adminita/ 

- **Website - GitHub**: https://github.com/djangify/adminita_demo

- **Website**: https://adminita.todiane.com (demo user login available)


## 💬 Support

Having trouble? Here are some ways to get help:

- 📖 Check the [documentation](https://adminita.todiane.com/infopages/docs)
- 🐛 [Open an issue](https://github.com/djangify/adminita/issues/new)
- 💡 [Start a discussion](https://github.com/djangify/adminita/discussions)

## 🗺️ Roadmap

- [x] Publish to PyPI
- [x] Fix dark mode toggle functionality
- [ ] Add more customization options
- [ ] Create additional color themes
- [ ] Improve accessibility (ARIA labels, keyboard navigation)
- [ ] Expand automated test coverage
- [ ] Create video tutorials
- [ ] Add support for Django inline forms
- [ ] Create a documentation website

## ⭐ Star History

If you find Adminita useful, please consider giving it a star on GitHub! It helps others discover the project.

---

Made with ❤️ by a Django enthusiast

**Note**: This is an open-source project. I appreciate your patience and contributions!

**Developer**: https://www.todiane.com 

**Developer LinkedIn**: https://linkedin.com/in/todianedev

**Coffee Always Welcome**: https://ko-fi.com/todianedev ❤️


Maintained by [Diane Corriette](https://github.com/todiane)