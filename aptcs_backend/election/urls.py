from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ElectionViewSet, CandidateViewSet, VoteCreateView

router = DefaultRouter()
router.register(r'elections', ElectionViewSet)
router.register(r'candidates', CandidateViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('vote/', VoteCreateView.as_view(), name='cast_vote'),
]
