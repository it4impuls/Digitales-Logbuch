from django.contrib import admin
from .models import Course, Attendee


class AttendeeInline(admin.TabularInline):
    model=Attendee
    

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    model = Course
    inlines = [AttendeeInline]

    list_display = ['title', 'host', 'get_attendees', 'get_attendees_attending']
    search_fields = ['title', 'host__username']
    
    readonly_fields = ['get_attendees', 'get_attendees_attending']

    @admin.display(description="Num attending")
    def get_attendees_attending(self, obj):
        return obj.attendee_set.filter(attends=True).count()
    
    @admin.display(description="total attendees")
    def get_attendees(self, obj):
        return obj.attendee_set.count()

@admin.register(Attendee)
class CourseAdmin(admin.ModelAdmin):
    model = Attendee
# admin.register(FullCourseAdmin)