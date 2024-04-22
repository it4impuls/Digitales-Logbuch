from rest_framework import viewsets, serializers, permissions
from .models import Course, Person, Appointment




class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'

    def to_representation(self, instance):
        return super().to_representation(instance)

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all().order_by('id')
    serializer_class = AppointmentSerializer


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all().order_by('id')
    serializer_class = PersonSerializer


class CourseSerializer(serializers.ModelSerializer):
    host = PersonSerializer()
    appointments = AppointmentSerializer(many=True, source="appointment_set")
    class Meta:
        model = Course
        fields = '__all__'

    def create(self, validated_data):
        host_obj = validated_data.pop('host')
        occ= host_obj.pop('occupation')
        host, created = Person.objects.get_or_create(**host_obj, defaults={"occupation":occ})
        
        return super().create({"host":host, **validated_data})
        
    
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('id')
    serializer_class = CourseSerializer