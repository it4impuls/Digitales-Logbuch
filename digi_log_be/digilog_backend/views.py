from rest_framework import viewsets, serializers, permissions
from .models import Event, Person



class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all().order_by('id')
    serializer_class = PersonSerializer
    # permission_classes = [permissions.AllowAny]


class EventSerializer(serializers.ModelSerializer):
    host = PersonSerializer(read_only=True)
    class Meta:
        model = Event
        fields = '__all__'

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('id')
    serializer_class = EventSerializer
    # permission_classes = [permissions.AllowAny]