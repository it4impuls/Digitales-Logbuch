from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'persons', views.PersonViewSet)
router.register(r'events', views.EventViewSet)

urlpatterns = [
    path('', include(router.urls))
]