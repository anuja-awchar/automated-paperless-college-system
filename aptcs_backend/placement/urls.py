from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PlacementDriveViewSet

router = DefaultRouter()
router.register(r'', PlacementDriveViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
