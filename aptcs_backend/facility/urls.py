from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FacilityViewSet, BookingViewSet

router = DefaultRouter()
router.register(r'facilities', FacilityViewSet)
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
]
