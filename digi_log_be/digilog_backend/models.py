from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.timezone import now
from django.contrib.auth.models import User as U
from django.shortcuts import HttpResponse
# from django.http.response import 


class User(U):
    ...

class Course(models.Model):
    name = models.CharField(max_length=30)
    description = models.TextField(blank=True)
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    atendees = models.ManyToManyField(User, related_name="attends", blank=True)



