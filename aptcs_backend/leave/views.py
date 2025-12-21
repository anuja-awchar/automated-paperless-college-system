from rest_framework import viewsets, permissions
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer

class LeaveRequestViewSet(viewsets.ModelViewSet):
    serializer_class = LeaveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'faculty']:
            return LeaveRequest.objects.all()
        return LeaveRequest.objects.filter(student=user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)
