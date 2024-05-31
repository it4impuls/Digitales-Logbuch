import json

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login
from django.shortcuts import redirect, render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET

from .authenticator import CustomAuthentication
from .serializers import AttendeeSerializer, ShortAttendeeSerializer, UserSerializer, CourseSerializer, myTokenObtainPairSerializer, myTokenRefreshSerializer, TokenVerifySerializer
from .models import Course, User, Attendee

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.decorators import permission_classes, authentication_classes

from rest_framework_simplejwt.views import TokenObtainPairView, TokenVerifyView, TokenRefreshView, TokenBlacklistView
from rest_framework_simplejwt.serializers import TokenVerifySerializer, TokenBlacklistSerializer
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.authentication import JWTAuthentication


# from django.views.decorators.vary import 
class DummyRequest:
    def __init__(self, data):
        self.data = data

class AuthViewset(viewsets.ModelViewSet):
    authentication_classes = [CustomAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in ('GET', "OPTIONS", "POST"):
            return []
        return super().get_permissions()

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = User.objects.filter(is_active=True).order_by('id')
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.request.method in ('GET', "POST", "OPTIONS"):
            return []
        return super().get_permissions()

class CourseViewSet(AuthViewset):
    queryset = Course.objects.all().order_by('id')
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.request.method in {'GET', "POST", "OPTIONS"}:
            return []
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        request.data["host"], token = CustomAuthentication().authenticate(request)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
class AttendeeViewSet(AuthViewset):
    queryset = Attendee.objects.all()
    serializer_class = AttendeeSerializer

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        try:
            user = User.objects.get(username=request.COOKIES.get("uname", None))
        except User.DoesNotExist:
            return Response("User not found", status=404)
        
        req = DummyRequest({"course":request.data.get("course", None), "attendee": user.id, "attends":"False"})
        ret = super().create(req, *args, **kwargs)
        ser = self.serializer_class(Attendee.objects.get(id=ret.data["id"]))
        # ser.is_valid(raise_exception=True)
        ret.data = ser.data
        print(ret.data)
        return ret

    def get_serializer_class(self):
        if self.action == "list":
            return AttendeeSerializer
        elif self.action == "create":
            return ShortAttendeeSerializer
        return super().get_serializer_class()
    
    def destroy(self, request, *args, **kwargs):
        ...
        return super().destroy(request, *args, **kwargs)
@csrf_exempt
def login_user(request):

    username = password = ""
    state = ""

    if request.method == "POST":
        body = json.loads(request.body)
        username = body.get('username')
        password = body.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            print("Valid account")
            return HttpResponse(status=200, content=user)
        else:
            print("Invalid account")
            return HttpResponse(status=400, content="Authentication failed")
    else:
        return render(request, 'digi_log/login.html')


class myTokenObtainPairView(TokenObtainPairView):
    serializer_class = myTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        # you need to instantiate the serializer with the request data
        serializer = self.get_serializer(data=request.data)
        # you must call .is_valid() before accessing validated_data
        serializer.is_valid(raise_exception=True)

        # get access and refresh tokens to do what you like with
        access = serializer.validated_data.get("access", None)
        refresh = serializer.validated_data.get("refresh", None)
        uname = serializer.validated_data.get("uname", None)

        # build your response and set cookie
        if access is not None:
            response = JsonResponse(
                {"access": access, "refresh": refresh, "uname": uname}, status=200)
            response.set_cookie('access', access, httponly=True)
            response.set_cookie('refresh', refresh, httponly=True)
            response.set_cookie('uname', uname)
            return response

        return HttpResponse({"Error": "Something went wrong"}, status = 400)

class myTokenRefreshView(TokenRefreshView):
    serializer_class = myTokenRefreshSerializer
    def post(self, request, *args, **kwargs):
        # super().post()
        # you need to instantiate the serializer with the request data
        refresh_token = request.COOKIES.get("refresh", None)
        if refresh_token is None:
            return HttpResponse({"Error": "No refresh Token found"}, status=400)
        serializer = self.get_serializer(data={"refresh":refresh_token})
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
        response.set_cookie("access", access, httponly=True)
        response.set_cookie("refresh", refresh, httponly=True)
        response.set_cookie("uname", uname)
        return response
    

class myTokenVerifyView(TokenVerifyView):
    serializer_class = TokenVerifySerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        try:
            serializer = self.get_serializer(
                data={"token": request.COOKIES.get("access") or request.data.get("access")})
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])
        return Response(serializer.validated_data, status=HTTP_200_OK)

class myTokenBlacklistView(TokenBlacklistView):
    serializer_class = TokenBlacklistSerializer
    def post(self, request: Request, *args, **kwargs) -> Response:
        return super().post(DummyRequest(request.COOKIES), *args, **kwargs)
    
@require_GET
@permission_classes([IsAuthenticated])
def getUser(request:HttpRequest):
    user, token = CustomAuthentication().authenticate(request)
    if user:
        return redirect("/api/users/"+str(user.id))
    else: return user
        