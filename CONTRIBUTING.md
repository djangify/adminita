# Contributing to Adminita

Thanks for your interest in improving Adminita! This guide covers how to set up a development environment, our coding standards, and how to submit changes.

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

1. **Fork the repository** and clone your fork:

   ```bash
   git clone https://github.com/<your-username>/adminita.git
   cd adminita
   ```

2. **Create a virtual environment**:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python and Node dependencies**:

   ```bash
   pip install -r requirements.txt
   pip install -e ".[dev]"
   npm install
   ```

4. **Build the CSS**:

   ```bash
   npm run build    # one-time build
   npm run watch     # auto-rebuild while developing
   ```

5. **Set up the demo project**:

   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```

   Visit `http://localhost:8000/admin/` to see your changes live.

## Making a Change

1. Create a feature branch off `main`:

   ```bash
   git checkout -b feature/short-description
   ```

2. Make your changes. Keep commits focused and use clear messages.
3. Run the test suite and linters before opening a PR:

   ```bash
   pytest
   ruff check .
   black --check .
   ```

4. If you changed CSS, make sure `npm run build` has been run and the generated file is included in your commit.
5. Push your branch and open a Pull Request against `main`. Fill out the PR template — it asks what changed and how you tested it.

## Coding Standards

- **Python**: formatted with `black` (line length 100) and linted with `ruff`. Follow Django conventions for app structure and naming.
- **Templates**: follow Django's template style; prefer overriding the smallest block/template possible rather than duplicating whole files.
- **CSS**: use Tailwind utility classes first; only add custom CSS in `adminita/static/src/input.css` when utilities can't do the job. Never hand-edit the generated `adminita-tailwind.css` file directly.
- **JavaScript**: keep it framework-free and minimal — the theme intentionally avoids a JS build step beyond Tailwind.
- **Dark mode**: any new UI must work correctly in both light and dark mode.
- **Accessibility**: use semantic HTML and ARIA attributes where appropriate; this is an area we actively want help improving.

## Testing

- Add or update tests in the `tests/` directory for any behavioral change (custom admin classes, context processors, template tags, etc.).
- Run `pytest` locally before submitting. CI runs the same suite across supported Python/Django versions on every PR.
- Manually verify in a browser: dark mode toggle, responsive/mobile layout, and the specific admin pages you touched.

## Reporting Bugs / Requesting Features

Please use the GitHub issue templates:

- [Report a bug](https://github.com/djangify/adminita/issues/new?template=bug_report.md)
- [Request a feature](https://github.com/djangify/adminita/issues/new?template=feature_request.md)

Include Django/Python versions, browser, and steps to reproduce for bugs.

## Priority Areas

We especially welcome help with:

- Mobile responsiveness testing and fixes
- Accessibility (ARIA labels, keyboard navigation, screen reader support)
- Additional color themes
- Expanding automated test coverage
- Documentation improvements

## Questions

Open a [GitHub Discussion](https://github.com/djangify/adminita/discussions) or an issue if you're not sure where to start — happy to point you at a good first task.
