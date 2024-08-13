import json

from django.contrib.auth import authenticate, login
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from rest_framework import viewsets
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenBlacklistSerializer, TokenVerifySerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import (
    TokenBlacklistView,
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from .authenticator import CustomAuthentication
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
    authentication_classes = [CustomAuthentication]
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

    @staticmethod
    def create(request, *args, **kwargs):
        try:
            (request.data["host"], _) = CustomAuthentication().authenticate(request)
        except Exception as e:
            raise AuthenticationFailed()
        if not request.data["host"]:
            raise AuthenticationFailed()
        return super().create(request, *args, **kwargs)

    def get_serializer_class(self):
        if self.action == "list":
            return ShortCourseSerializer
        return super().get_serializer_class()

    def update(self, request, *args, **kwargs):
        try:
            request.data["host"], _ = CustomAuthentication().authenticate(request)
        except Exception as e:
            raise AuthenticationFailed()
        if not request.data["host"]:
            raise AuthenticationFailed()

        if self.get_object().host != request.data["host"]:
            raise AuthenticationFailed()

        return super().update(request, *args, **kwargs)

class AttendeeViewSet(AuthViewset):
    queryset = Attendee.objects.all()
    serializer_class = AttendeeSerializer

    @staticmethod
    def list(request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        user, _ = CustomAuthentication().authenticate(request)
        if not user:
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
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # get access and refresh tokens to do what you like with
        access = serializer.validated_data.get("access", None)
        refresh = serializer.validated_data.get("refresh", None)
        uname = serializer.validated_data.get("uname", None)

        # build your response and set cookie
        if not access or not refresh:
            return HttpResponse({"Error: Something went wrong"}, status=400)
        rtoken = RefreshToken(refresh)
        response = JsonResponse({"access": access, "refresh": refresh, "uname": uname}, status=200)
        response.set_cookie("access", access, httponly=True, samesite="strict")
        response.set_cookie(
            "refresh",
            refresh,
            httponly=True,
            samesite="strict",
            expires=rtoken.lifetime + rtoken.current_time,
        )
        response.set_cookie(
            "uname", uname, samesite="lax", expires=rtoken.lifetime + rtoken.current_time
        )
        return response


class myTokenRefreshView(TokenRefreshView):
    serializer_class = myTokenRefreshSerializer
    def get(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh", None)
        if refresh_token is None:
            return HttpResponse({"Error; No refresh Token found"}, status=400)
        serializer = self.get_serializer(data={"refresh": refresh_token})
        # you must call .is_valid() before accessing validated_data
        serializer.is_valid(raise_exception=True)
        # get access and refresh tokens to do what you like with
        access = serializer.validated_data.get("access", None)
        refresh = serializer.validated_data.get("refresh", None)
        uname = serializer.validated_data.get("uname", None)

        # build your response and set cookie
        if access is None:
            return HttpResponse({"Error": "Something went wrong"}, status=400)
        response = JsonResponse({"access": access, "refresh": refresh, "uname": uname}, status=200)
        rtoken = RefreshToken(refresh)
        response.set_cookie("access", access, httponly=True, samesite="strict")
        response.set_cookie(
            "refresh",
            refresh,
            httponly=True,
            samesite="strict",
            expires=rtoken.lifetime + rtoken.current_time,
        )
        response.set_cookie(
            "uname", uname, samesite="lax", expires=rtoken.lifetime + rtoken.current_time
        )
        return response


class myTokenVerifyView(TokenVerifyView):
    serializer_class = TokenVerifySerializer

    @staticmethod
    def post(request: Request, *args, **kwargs) -> Response:
        return super().post(request, *args, **kwargs)

class myTokenBlacklistView(TokenBlacklistView):
    serializer_class = TokenBlacklistSerializer
    @staticmethod
    def post(request: Request, *args, **kwargs) -> Response:
        return super().post(DummyRequest(request.COOKIES), *args, **kwargs)

@require_GET
@permission_classes([IsAuthenticated])
def getUser(request: HttpRequest):
    user, _ = CustomAuthentication().authenticate(request)
    if user:
        serializer = UserSerializer(instance=user)
        return JsonResponse(serializer.data)
    return user