import json
from operator import contains
import typing

from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .authenticator import CustomAuthentication
from .serializers import UserSerializer, CourseSerializer, myTokenObtainPairSerializer, TokenVerifySerializer
from .models import Course, User

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from rest_framework_simplejwt.views import TokenObtainPairView, TokenVerifyView
from rest_framework_simplejwt.serializers import TokenVerifySerializer
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.status import HTTP_200_OK

# from django.views.decorators.vary import 


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

    def create(self, request, *args, **kwargs):
        # request["host"] = self.perform_authentication()
        return super().create(request, *args, **kwargs)

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
            # response.set_cookie('token', access, httponly=True)
            # response.set_cookie('refresh', refresh, httponly=True)
            # response.set_cookie('uname', uname, httponly=True)
            return response

        return HttpResponse({"Error": "Something went wrong"}, status = 400)

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
