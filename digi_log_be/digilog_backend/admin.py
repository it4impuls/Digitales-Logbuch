from django.contrib import admin

from .models import Person, Course, Appointment

admin.site.register(Person)
admin.site.register(Course)
admin.site.register(Appointment)