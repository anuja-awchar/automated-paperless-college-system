from rest_framework import serializers
from .models import LeaveRequest

class LeaveRequestSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.username')

    class Meta:
        model = LeaveRequest
        fields = ['id', 'student', 'student_name', 'reason', 'start_date', 'end_date', 'status', 'document', 'created_at']
        read_only_fields = ['student', 'status', 'created_at']
