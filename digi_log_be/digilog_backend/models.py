from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.timezone import now

class Person(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    occupation = models.CharField(max_length=30, blank=True)

class Course(models.Model):
    name = models.CharField(max_length=30)
    description = models.TextField(blank=True)
    host = models.ForeignKey(Person, on_delete=models.CASCADE)
    atendees = models.ManyToManyField(Person, related_name="attends", blank=True)
    

class Appointment(models.Model):
    # objects = all()
    class Status(models.TextChoices):
        NORMAL = ("NM", _("Normal"))
        CANCLED = ("CL", _("Cancled"))
        
    #     __empty__ = _("(Unknown)")

    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    date = models.DateTimeField(default=now)
    duration = models.DurationField("2 hours")
    status = models.CharField(max_length=2,choices = Status, default=Status.NORMAL) 