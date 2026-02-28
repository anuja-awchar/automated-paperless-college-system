from rest_framework import serializers
from .models import Notice

class NoticeSerializer(serializers.ModelSerializer):
    posted_by_name = serializers.ReadOnlyField(source='posted_by.username')

    class Meta:
        model = Notice
        fields = ['id', 'title', 'content', 'priority', 'posted_by', 'posted_by_name', 'created_at', 'updated_at']
        read_only_fields = ['posted_by', 'created_at', 'updated_at']
