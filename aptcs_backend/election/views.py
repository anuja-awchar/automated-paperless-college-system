from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from .models import Election, Candidate, Vote
from .serializers import ElectionSerializer, CandidateSerializer, VoteSerializer

from django.db.models import Count, Prefetch

class ElectionViewSet(viewsets.ModelViewSet):
    queryset = Election.objects.all()
    serializer_class = ElectionSerializer
    
    def get_queryset(self):
        return Election.objects.prefetch_related(
            Prefetch('candidates', queryset=Candidate.objects.annotate(votes_annotated=Count('votes')))
        )

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()] # Only admin can create/update elections

class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

class VoteCreateView(generics.CreateAPIView):
    serializer_class = VoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
