import pytest

from adminita.context_processors import admin_app_list


def test_is_a_deprecated_no_op(rf):
    request = rf.get("/admin/")
    with pytest.warns(DeprecationWarning):
        assert admin_app_list(request) == {}
