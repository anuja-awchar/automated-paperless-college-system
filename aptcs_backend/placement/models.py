from django.db import models
from django.conf import settings

class PlacementDrive(models.Model):
    company_name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    description = models.TextField()
    eligibility = models.TextField()
    salary = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    apply_link = models.URLField(max_length=500, blank=True)
    deadline = models.DateTimeField()
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.company_name} - {self.role}"

    class Meta:
        ordering = ['-deadline']
