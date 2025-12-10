readme for Adminita

![adminita header](https://github.com/djangify/adminita/blob/336735abb0e7679f4e2622615f891d178fd4bab3/adminita-homepage.png)


# Adminita

A modern, beautiful Django admin theme built with Tailwind CSS v4. Transform your Django admin interface into a sleek, responsive dashboard with dark mode support.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![Django](https://img.shields.io/badge/django-4.0+-green.svg)
![Tailwind CSS](https://img.shields.io/badge/tailwind-v4-38bdf8.svg)

## ✨ Features

- 🎨 **Modern UI** - Clean, professional interface built with Tailwind CSS v4
- 🌓 **Dark Mode** - System preference detection with manual toggle
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎯 **Easy Integration** - Drop-in replacement for Django's default admin
- ⚡ **Fast** - Optimized CSS with no unnecessary bloat
- 🔧 **Customizable** - Easy to customize colors and styling
- 🆓 **Open Source** - MIT licensed, free to use and modify

## 📸 Screenshots

### Light Mode

![adminita light dashboard](https://github.com/djangify/adminita/blob/ac1e111dcf7ffae28dcdca60a78dbf32c848d035/adminita-lightdashboard.png)

### Dark Mode
![Dark Mode Dashboard - IMAGE COMING SOON - once I fix it!]

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
│   │   │   └── output.css    # Generated CSS (don't edit)
│   │   ├── js/
│   │   │   └── admin.js      # JavaScript for dark mode & mobile menu
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

### Dark Mode Not Working

**Status**: Open Issue  
**Priority**: High

The dark mode toggle button appears in the interface, but clicking it does not switch between light and dark themes. This is a known bug that we're actively working on.

**Expected Behavior**: Clicking the moon/sun icon should toggle between light and dark mode, with the preference saved to localStorage.

**Current Behavior**: Nothing happens when the toggle button is clicked.

**Workaround**: None currently available.

**Help Wanted**: If you have experience with JavaScript and dark mode implementation, we'd love your help! See [Contributing](#-contributing) below.

### Logout Button Security (FIXED ✅)

~~The logout button was using a GET request instead of POST, causing a 405 error.~~

**Status**: Fixed in latest version

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

We welcome contributions! Adminita is an open-source project and we'd love your help making it better.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Priority Issues

We especially need help with:

- 🐛 **Dark Mode Bug** - The toggle isn't working (see [Known Issues](#-known-issues))
- 📱 **Mobile Responsiveness** - Testing on various devices
- ♿ **Accessibility** - ARIA labels, keyboard navigation, screen reader support
- 🎨 **Additional Themes** - Creating alternative color schemes
- 📝 **Documentation** - Improving guides and examples

### Development Guidelines

- Follow Django's template style guidelines
- Use Tailwind CSS utility classes (avoid custom CSS when possible)
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Ensure dark mode compatibility for all new features
- Update documentation for any new features

## 📦 Requirements

- Python 3.10+
- Django 4.2+
- Node.js (for building CSS during development)
- npm (for managing Tailwind CSS)

## 🧪 Testing

```bash
# Run Django tests
python manage.py test

# Test in multiple browsers
# Test dark mode toggle
# Test responsive design on mobile devices
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- Built with [Django](https://www.djangoproject.com/)
- Styled with [Tailwind CSS v4](https://tailwindcss.com/)
- Inspired by modern admin dashboards

## 🔗 Links

- **GitHub**: https://github.com/djangify/adminita
- **Issues**: https://github.com/djangify/adminita/issues
- **PyPI**: https://pypi.org/project/adminita/ (coming soon)

## 💬 Support

Having trouble? Here are some ways to get help:

- 📖 Check the [documentation](https://github.com/djangify/adminita/wiki)
- 🐛 [Open an issue](https://github.com/djangify/adminita/issues/new)
- 💡 [Start a discussion](https://github.com/djangify/adminita/discussions)

## 🗺️ Roadmap

- [ ] Fix dark mode toggle functionality
- [ ] Add more customization options
- [ ] Create additional color themes
- [ ] Improve accessibility (ARIA labels, keyboard navigation)
- [ ] Add comprehensive test suite
- [ ] Create video tutorials
- [ ] Publish to PyPI
- [ ] Add support for Django inline forms
- [ ] Create a documentation website

## ⭐ Star History

If you find Adminita useful, please consider giving it a star on GitHub! It helps others discover the project.

---

Made with ❤️ by a Django enthusiast

**Note**: This is an open-source project. I appreciate your patience and contributions!
