from django.db import models


class Person(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    occupation = models.CharField(max_length=30)

class Event(models.model):
    name = models.CharField(max_length=30)
    description = models.TextField(blank=True)
    host = models.OneToOneField(Person, on_delete=models.CASCADE)
    atendees = models.ManyToOneRel(Person, on_delete=models.CASCADE)