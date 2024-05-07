from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.timezone import now
from django.contrib.auth.models import User as U
from django.shortcuts import HttpResponse
# from django.http.response import 


class User(U):
    ...



class Course(models.Model):
    class Level(models.TextChoices):
        BEGINNER = "I", _("I Anfänger")
        INTERMEDIATE = "II", _("II Fortgeschritten")
        ADVANCES = "III", _("III Profi")

    

    # description = models.TextField(blank=True)
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    qualification = models.CharField(max_length=20, blank=True)
    title = models.CharField(max_length=20)
    level = models.CharField(choices=Level, max_length=3)
    requirements = models.CharField(max_length=20, blank=True)
    description_short = models.CharField(max_length=20, blank=True)
    content_list = models.TextField()
    methods = models.CharField(max_length=20, blank=True)
    material = models.CharField(max_length=20, blank=True)
    dates = models.CharField(max_length=20, blank=True)
    duration = models.DurationField(default="2:00:00")

class Attendee(models.Model):
    attends = models.BooleanField()
    attendee = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)