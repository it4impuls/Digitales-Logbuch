from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenVerifyView
from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'courses', views.CourseViewSet)
router.register(r'attendees', views.AttendeeViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.login_user, name="login"),
    path('logout/', views.myTokenBlacklistView.as_view(), name="logout"),
    path('token/', views.myTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', views.myTokenRefreshView.as_view(), name='token_refresh'),
    path('token/blacklist/', views.myTokenBlacklistView.as_view(),
         name='token_blacklist'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('token/user/', TokenVerifyView.as_view(), name='token_user'),
    path('authTest/', views.myTokenVerifyView.as_view(), name='token_test'),
    path("getUser/", views.getUser, name="getuser")
]