from rest_framework import viewsets, serializers, exceptions
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenVerifySerializer
from rest_framework.validators import UniqueValidator
from .models import User, Course, Attendee




class myTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        
        data = super().validate(attrs)
        assert self.user != None
        refresh = self.get_token(self.user)
        data["refresh"] = str(refresh)   # comment out if you don't want this
        data["access"] = str(refresh.access_token)
        data["uname"] = self.user.get_username()

        """ Add extra responses here should you wish
        data["userid"] = self.user.id
        data["my_favourite_bird"] = "Jack Snipe"
        """
        return data


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password',
                  'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user
    
class AttendeeSerializer(serializers.ModelSerializer):
    attendee = UserSerializer()
    class Meta:
        model = Attendee
        fields = ["id","attendee", "attends"]
    
class CourseSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)
    attendees = AttendeeSerializer(many=True, source="attendee_set")

    class Meta:
        model = Course
        fields = '__all__'

    def create(self, validated_data):
        host_obj = validated_data.pop('host')
        host, created = User.objects.get_or_create(
            **host_obj, defaults={})
        
        course = super().create({"host": host, **validated_data})
        return course
    
    def update(self, instance, validated_data):
        
        return super().update(instance, validated_data)

