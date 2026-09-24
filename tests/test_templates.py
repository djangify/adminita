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
