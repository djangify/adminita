"""
Custom template tags for Adminita admin theme.
Provides Django 6.0 compatibility for readonly field rendering.
"""

from django import template
from django.utils.html import conditional_escape
from django.utils.safestring import mark_safe

register = template.Library()


@register.filter
def safe_contents(field):
    """
    Safely get the contents of a readonly field.

    Django 6.0 changed format_html() to require args or kwargs,
    which can cause AdminReadonlyField.contents() to fail for
    certain field types. This filter catches that error and
    provides a fallback.
    """
    try:
        # Try the normal contents() method
        return field.contents()
    except TypeError as e:
        if "args or kwargs must be provided" in str(e):
            # Fallback: try to get the value directly
            try:
                # AdminReadonlyField stores field info in self.field dict
                field_obj = field.field.get("field")
                if callable(field_obj):
                    # It's a callable (method on model or modeladmin)
                    result = field_obj(field.form.instance)
                else:
                    # It's a field name, get value from form instance
                    if hasattr(field.form, "instance") and field.form.instance:
                        result = getattr(field.form.instance, field_obj, "")
                    else:
                        result = ""

                if result is None:
                    result = field.empty_value_display

                return conditional_escape(result)
            except Exception:
                # Last resort: return empty value display
                return field.empty_value_display
        else:
            raise
    except Exception:
        # For any other error, return empty value display
        return getattr(field, "empty_value_display", "-")
