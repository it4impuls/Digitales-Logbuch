from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'persons',         views.PersonViewSet)
router.register(r'courses',         views.CourseViewSet)
router.register(r'appointments',    views.AppointmentViewSet)

urlpatterns = [
    path('', include(router.urls))
]