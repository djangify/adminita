from django.db import models


class SampleModel(models.Model):
    """A throwaway model used only to exercise Adminita's admin utility classes."""

    name = models.CharField(max_length=100)

    class Meta:
        app_label = "testapp"

    def __str__(self):
        return self.name
