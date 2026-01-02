from rest_framework import serializers
from .models import Complaint

class ComplaintSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = Complaint
        fields = ['id', 'subject', 'description', 'is_anonymous', 'status', 'created_at', 'student', 'student_name']
        read_only_fields = ['student', 'status', 'created_at']

    def get_student_name(self, obj):
        if obj.is_anonymous:
            return "Anonymous"
        return obj.student.username
