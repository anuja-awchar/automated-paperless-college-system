from rest_framework import serializers
from .models import Election, Candidate, Vote
from django.utils import timezone

class CandidateSerializer(serializers.ModelSerializer):
    vote_count = serializers.SerializerMethodField()

    class Meta:
        model = Candidate
        fields = ['id', 'name', 'manifesto', 'photo', 'election', 'vote_count']

    def get_vote_count(self, obj):
        return getattr(obj, 'votes_annotated', obj.votes.count())

class ElectionSerializer(serializers.ModelSerializer):
    candidates = CandidateSerializer(many=True, read_only=True)
    is_voted = serializers.SerializerMethodField()

    class Meta:
        model = Election
        fields = ['id', 'title', 'description', 'start_date', 'end_date', 'is_active', 'is_open', 'candidates', 'is_voted']

    def get_is_voted(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return Vote.objects.filter(election=obj, voter=user).exists()
        return False

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'election', 'candidate']
        read_only_fields = ['voter']

    def validate(self, data):
        election = data['election']
        user = self.context['request'].user

        # Check if election is open
        if not election.is_open:
            raise serializers.ValidationError("Election is not currently open for voting.")

        # Check if user has already voted
        if Vote.objects.filter(election=election, voter=user).exists():
            raise serializers.ValidationError("You have already voted in this election.")
        
        # Check if candidate belongs to election
        if data['candidate'].election != election:
            raise serializers.ValidationError("Invalid candidate for this election.")

        return data

    def create(self, validated_data):
        validated_data['voter'] = self.context['request'].user
        return super().create(validated_data)
