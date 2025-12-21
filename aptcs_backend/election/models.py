from django.db import models
from django.conf import settings
from django.utils import timezone

class Election(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title
    
    @property
    def is_open(self):
        now = timezone.now()
        return self.start_date <= now <= self.end_date and self.is_active

class Candidate(models.Model):
    election = models.ForeignKey(Election, related_name='candidates', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    manifesto = models.TextField()
    photo = models.ImageField(upload_to='candidates/', blank=True, null=True) # Requires Pillow

    def __str__(self):
        return f"{self.name} - {self.election.title}"

class Vote(models.Model):
    election = models.ForeignKey(Election, related_name='votes', on_delete=models.CASCADE)
    candidate = models.ForeignKey(Candidate, related_name='votes', on_delete=models.CASCADE)
    voter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('election', 'voter') # Ensures one vote per student per election

    def __str__(self):
        return f"{self.voter.username} voted in {self.election.title}"
