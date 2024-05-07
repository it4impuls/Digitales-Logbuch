from django.contrib import admin
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken 
from .models import Course, Attendee


class AttendeeInline(admin.TabularInline):
    model=Attendee
    

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    model = Course
    inlines = [AttendeeInline]

@admin.register(Attendee)
class CourseAdmin(admin.ModelAdmin):
    model = Attendee
# admin.register(FullCourseAdmin)