from typing import Any, Dict

from rest_framework import exceptions, serializers
from rest_framework.validators import UniqueTogetherValidator, UniqueValidator
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Attendee, Course, User


class myTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        assert self.user is not None
        data["uname"] = self.user.get_username()

        return data

class myTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs: Dict[str, Any]) -> Dict[str, str]:
        try:
            attrs.update(super().validate(attrs))
        except TokenError as e:
            raise exceptions.AuthenticationFailed(e)
        token = RefreshToken(attrs["refresh"])
        user = User.objects.get(
            id=token["user_id"]
        ) 
        attrs["uname"] = user.username
        return attrs

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )
    username = serializers.CharField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name')
        extra_kwargs = {'first_name': {'required': True}, 'last_name': {'required': True}}

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class ShortAttendeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendee
        fields = "__all__"
        validators = [
            UniqueTogetherValidator(queryset=Attendee.objects.all(), fields=["attendee", "course"])
        ]


class AttendeeSerializer(serializers.ModelSerializer):
    attendee = UserSerializer(read_only=False, required=False)
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Attendee
        fields = ["id", "attendee", "attends", "course"]

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

    class Meta:
        model = Course
        fields = "__all__"

class CourseSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)
    attendees = AttendeeSerializer(many=True, source="attendee_set", read_only=True)

    class Meta:
        model = Course
        fields = "__all__"

    def create(self, validated_data):
        user = self.initial_data.get('host', None)
        if not user:
            raise exceptions.ValidationError("Host not specified")
        attendees = validated_data.pop("attendee_set", [])
        return self.Meta.model.objects.create(host=user, **validated_data)

    def update(self, instance, validated_data):
        attendees = validated_data.pop("attendee_set", [])

        for a in attendees:
            try:
                attendee = Attendee.objects.get(id=a.pop("id"), course=self.instance)
                attendee.attends = a.get("attends", attendee.attends)
                attendee.save()
            except Attendee.DoesNotExist:
                Attendee.objects.create(course=self.instance, **a)

        return super().update(instance, validated_data)