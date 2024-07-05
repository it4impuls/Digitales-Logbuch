from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User




class Course(models.Model):
    def __str__(self):
        return f"{self.id}: {self.title}"
    
    class Level(models.TextChoices):
        BEGINNER = "I", _("I Anfänger")
        INTERMEDIATE = "II", _("II Fortgeschritten")
        ADVANCES = "III", _("III Profi")

    host = models.ForeignKey(User, on_delete=models.CASCADE)
    qualification = models.CharField(max_length=100, blank=True)
    title = models.CharField(max_length=100)
    level = models.CharField(choices=Level, max_length=3, default="I")
    requirements = models.CharField(max_length=100, blank=True)
    description_short = models.CharField(max_length=100, blank=True)
    content_list = models.TextField()
    methods = models.CharField(max_length=100, blank=True)
    material = models.CharField(max_length=100, blank=True)
    dates = models.CharField(max_length=100, blank=True)
    duration = models.CharField(max_length = 100, default="2:00:00")


class Attendee(models.Model):
    attends = models.BooleanField()
    attendee = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)


