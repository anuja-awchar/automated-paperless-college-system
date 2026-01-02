from rest_framework import viewsets, permissions
from .models import Complaint
from .serializers import ComplaintSerializer

class ComplaintViewSet(viewsets.ModelViewSet):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Complaint.objects.all()
        # Students see only their own complaints
        return Complaint.objects.filter(student=user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)
