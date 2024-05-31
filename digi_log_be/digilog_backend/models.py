from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.timezone import now
from django.contrib.auth.models import User
from django.shortcuts import HttpResponse
# from django.http.response import 




class Course(models.Model):
    class Level(models.TextChoices):
        BEGINNER = "I", _("I Anfänger")
        INTERMEDIATE = "II", _("II Fortgeschritten")
        ADVANCES = "III", _("III Profi")

    

    # description = models.TextField(blank=True)
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    qualification = models.CharField(max_length=40, blank=True)
    title = models.CharField(max_length=40)
    level = models.CharField(choices=Level, max_length=3)
    requirements = models.CharField(max_length=40, blank=True)
    description_short = models.CharField(max_length=60, blank=True)
    content_list = models.TextField()
    methods = models.CharField(max_length=40, blank=True)
    material = models.CharField(max_length=40, blank=True)
    dates = models.CharField(max_length=40, blank=True)
    duration = models.CharField(max_length = 40, default="2:00:00")

class Attendee(models.Model):
    attends = models.BooleanField()
    attendee = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)