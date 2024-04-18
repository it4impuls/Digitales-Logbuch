from django.db import models


class Person(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    occupation = models.CharField(max_length=30)

class Event(models.Model):
    name = models.CharField(max_length=30)
    description = models.TextField(blank=True)
    host = models.ForeignKey(Person, on_delete=models.CASCADE)
    atendees = models.ManyToManyField(Person, related_name="attends", blank=True)