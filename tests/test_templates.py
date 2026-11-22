import json

from django.template.loader import get_template, render_to_string


def test_popup_response_escapes_object_repr():
    data = json.dumps({"value": "1", "obj": "</script><script>alert(1)</script>"})
    html = render_to_string("admin/popup_response.html", {"popup_response_data": data})
    assert "<script>alert(1)" not in html


def test_registration_templates_use_adminita_versions():
    for name in ("logged_out", "password_change_form", "password_change_done"):
        template = get_template(f"registration/{name}.html")
        assert "adminita" in template.origin.name


def test_sidebar_sections_are_collapsible_and_current_one_is_open():
    shop = {
        "name": "Shop",
        "app_label": "shop",
        "models": [{"name": "Products", "admin_url": "/admin/shop/product/"}],
    }
    blog = {
        "name": "Blog",
        "app_label": "blog",
        "models": [{"name": "Posts", "admin_url": "/admin/blog/post/"}],
    }

    class Req:
        path = "/admin/shop/product/"

    html = render_to_string(
        "admin/base.html", {"available_apps": [shop, blog], "request": Req()}
    )
    assert html.count('<details class="sb-group"') == 2
    assert 'data-group="shop" open data-active="1"' in html
    assert 'data-group="blog">' in html
    assert 'data-sb-action="expand"' in html
    assert 'data-sb-action="collapse"' in html
    assert "adminita-sidebar.js" in html and "adminita-sidebar.css" in html
