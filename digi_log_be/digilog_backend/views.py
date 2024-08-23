import json
from rest_framework.settings import api_settings
from django.contrib.auth import authenticate, login
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from rest_framework import viewsets
from rest_framework.decorators import permission_classes, authentication_classes, api_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenBlacklistSerializer, TokenVerifySerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import (
    TokenBlacklistView,
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .models import Attendee, Course, User
from .serializers import (
    AttendeeSerializer,
    CourseSerializer,
    ShortAttendeeSerializer,
    ShortCourseSerializer,
    UserSerializer,
    myTokenObtainPairSerializer,
    myTokenRefreshSerializer,
)


# from django.views.decorators.vary import
class DummyRequest:
    def __init__(self, data):
        self.data = data

class AuthViewset(viewsets.ModelViewSet):
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in {'GET', "OPTIONS", "POST"}:
            return []
        return super().get_permissions()

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = User.objects.filter(is_active=True).order_by("id")
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.request.method in {'GET', "POST", "OPTIONS"}:
            return []
        return super().get_permissions()

class CourseViewSet(AuthViewset):
    queryset = Course.objects.all().order_by("id")
    serializer_class = CourseSerializer

    def create(self, request:HttpRequest, *args, **kwargs):
        if request.user.is_anonymous:
            raise AuthenticationFailed()
        request.data["host"] = request.user
        return super().create(request, *args, **kwargs)

    def get_serializer_class(self):
        if self.action == "list":
            return ShortCourseSerializer
        return super().get_serializer_class()

    def update(self, request, *args, **kwargs):
        if self.get_object().host != request.user:
            raise AuthenticationFailed("Only the author can update this course")
        request.data["host"] = request.user

        return super().update(request, *args, **kwargs)

class AttendeeViewSet(AuthViewset):
    queryset = Attendee.objects.all()
    serializer_class = AttendeeSerializer

    def create(self, request, *args, **kwargs):
        user = request.user
        if user.is_anonymous:
            raise AuthenticationFailed()

        req = DummyRequest(
            {"course": request.data.get("course", None), "attendee": user.id, "attends": "False"}
        )
        ret = super().create(req, *args, **kwargs)
        ser = self.serializer_class(Attendee.objects.get(id=ret.data["id"]))
        ret.data = ser.data
        return ret

    def get_serializer_class(self):
        if self.action == "list":
            return AttendeeSerializer
        if self.action == "create":
            return ShortAttendeeSerializer
        return super().get_serializer_class()

@csrf_exempt
def login_user(request):
    username = password = ""

    if request.method != "POST":
        request.data = request.GET.copy()
        return render(request, 'digi_log/login.html')

    body = json.loads(request.body)
    username = body.get('username')
    password = body.get('password')
    user = authenticate(username=username, password=password)

    if user is not None:
        login(request, user)
        print("Valid account")
        return HttpResponse(status=200, content=user)
    print("Invalid account")
    return HttpResponse(status=401, content="Authentication failed")


class myTokenObtainPairView(TokenObtainPairView):
    serializer_class = myTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        # build your response and set cookie
        if response.status_code == 200:
            data = response.data
            rtoken = RefreshToken(data["refresh"])
            response.set_cookie("access", data["access"], httponly=True, samesite="strict")
            response.set_cookie(
                "refresh",
                data["refresh"],
                httponly=True,
                samesite="strict",
                expires=rtoken.lifetime + rtoken.current_time,
            )
            response.set_cookie(
                "uname", data["uname"], samesite="lax", expires=rtoken.lifetime + rtoken.current_time
            )
        return response


class myTokenRefreshView(TokenRefreshView):
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    serializer_class = myTokenRefreshSerializer
    def get(self, request, *args, **kwargs):
        # RefreshToken.verify(request.user)
        try: 
            response = super().post(DummyRequest(request.COOKIES))
        except AuthenticationFailed as e:
            response = Response({"detail": str(e.args[0])}, status=401)
            response.delete_cookie("access")
            response.delete_cookie("refresh")
            response.delete_cookie("uname")
            return response
        except Exception as e:
            raise e
        rToken = RefreshToken(response.data["refresh"])
        response.set_cookie("access", response.data["access"], httponly=True, samesite="strict")
        response.set_cookie(
            "refresh",
            response.data["refresh"],
            httponly=True,
            samesite="strict",
            expires=rToken.lifetime + rToken.current_time,
        )
        response.set_cookie(
            "uname", response.data["uname"], samesite="lax", expires=rToken.lifetime + rToken.current_time
        )
        return response


class myTokenVerifyView(TokenVerifyView):
    serializer_class = TokenVerifySerializer

class myTokenBlacklistView(TokenBlacklistView):
    serializer_class = TokenBlacklistSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        response =  super().post(DummyRequest(request.COOKIES), *args, **kwargs)
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        response.delete_cookie("uname")
        return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes(api_settings.DEFAULT_AUTHENTICATION_CLASSES)
def getUser(request: HttpRequest):
    user = request.user
    if user.is_anonymous:
        raise AuthenticationFailed()
    serializer = UserSerializer(instance=user)
    return JsonResponse(serializer.data)