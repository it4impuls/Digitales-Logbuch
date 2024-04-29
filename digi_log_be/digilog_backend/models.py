from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.timezone import now
from django.contrib.auth.models import User as U
from django.shortcuts import HttpResponse
# from django.http.response import 


class User(U):
    ...

class Course(models.Model):
    class CourseInfo(models.Model):
        class Level(models.TextChoices):
            BEGINNER = "I", _("I Anfänger")
            INTERMEDIATE = "II", _("II Fortgeschritten")
            ADVANCES = "III", _("I Profi")


        qualification = models.CharField(max_length=20)
        title = models.CharField(max_length=20)
        level = models.CharField(choices=Level, max_length=3)
        requirements = models.CharField(max_length=20)
        description_short = models.CharField(max_length=20)
        content_list = models.TextField()
        methods = models.CharField(max_length=20)
        material = models.CharField(max_length=20)
        dates = models.CharField(max_length=20)
        duration = models.DurationField(default="2 Hours")


        ...
    name = models.CharField(max_length=30)
    info = models.ForeignKey(CourseInfo, on_delete=models.CASCADE)
    # description = models.TextField(blank=True)
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    atendees = models.ManyToManyField(User, related_name="attends", blank=True)



