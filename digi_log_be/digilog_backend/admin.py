from django.contrib import admin

from .models import Person, Event

admin.site.register(Person)
admin.site.register(Event)