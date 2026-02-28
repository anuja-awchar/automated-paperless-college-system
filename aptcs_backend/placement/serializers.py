from rest_framework import serializers
from .models import PlacementDrive

class PlacementDriveSerializer(serializers.ModelSerializer):
    posted_by_name = serializers.ReadOnlyField(source='posted_by.username')

    class Meta:
        model = PlacementDrive
        fields = '__all__'
        read_only_fields = ['posted_by', 'created_at']
