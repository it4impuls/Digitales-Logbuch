from typing import Any, Dict
from rest_framework import viewsets, serializers, exceptions
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer,\
    TokenVerifySerializer, \
    TokenRefreshSerializer, \
    TokenBlacklistSerializer
from rest_framework.validators import UniqueValidator, UniqueTogetherValidator
from rest_framework_simplejwt.exceptions import TokenError
from .models import User, Course, Attendee




class myTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        try:
            data = super().validate(attrs)
        except TokenError as e:
            return exceptions.AuthenticationFailed(e.detail)
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
    
class myTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs: Dict[str, Any]) -> Dict[str, str]:
        try:
            attrs["access"] = super().validate(attrs)["access"]
        except TokenError as e:
            return exceptions.AuthenticationFailed(e.detail)
        attrs["uname"] = User.objects.get(id=self.token_class(attrs["refresh"]).get("user_id")).username
        return attrs

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    username = serializers.CharField(required = True, validators = [UniqueValidator(queryset=User.objects.all())])
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
    
class ShortAttendeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendee
        fields = "__all__"
        validators=[
            UniqueTogetherValidator(
                queryset=Attendee.objects.all(), 
                fields=["attendee", "course"])]
    
class AttendeeSerializer(serializers.ModelSerializer):
    attendee = UserSerializer(read_only=False, required=False)
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Attendee
        fields = ['id', 'attendee', 'attends', 'course']

    def create(self, validated_data):
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
    
    def is_valid(self, *, raise_exception=False):
        return super().is_valid(raise_exception=raise_exception)
    
    def validate(self, attrs):
        return super().validate(attrs)

    
class ShortCourseSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)
    AttendeeSerializer(many=True, source="attendee_set", read_only=True)

    class Meta:
        model = Course
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)
    attendees = AttendeeSerializer(many=True, source="attendee_set", read_only=True)

    class Meta:
        model = Course
        fields = '__all__'

    def create(self, validated_data):
        user = self.initial_data.get('host', None)
        if not user:
            raise exceptions.ValidationError("Host not specified")
        attendees = validated_data.pop('attendee_set', [])
        course = self.Meta.model.objects.create(host= user, **validated_data)
        return course
    
    def update(self, instance, validated_data):
        attendees = validated_data.pop('attendee_set',[])
        
        for a in attendees:
            try:
                attendee = Attendee.objects.get(id=a.pop("id"), course=self.instance)
                attendee.attends = a.get("attends", attendee.attends)
                attendee.save()
            except Attendee.DoesNotExist:
                Attendee.objects.create(course=self.instance, **a)

            
        return super().update(instance, validated_data)
    
# class MyTokenBlacklistSerializer(TokenBlacklistSerializer):
#     def validate(self, attrs: Dict[str, Any]) -> Dict[str, str]:
#         attrs["access"] = super().validate(attrs)["access"]
#         attrs["uname"] = User.objects.get(id=self.token_class(attrs["refresh"]).get("user_id")).username
#         return attrs