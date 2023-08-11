from django.contrib import admin

from core.models import TestModel


@admin.register(TestModel)
class TestAdmin(admin.ModelAdmin):
    pass
