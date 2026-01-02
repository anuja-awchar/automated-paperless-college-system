from django.db import models
from django.conf import settings

class Complaint(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('resolved', 'Resolved'),
        ('dismissed', 'Dismissed'),
    )
    student = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='complaints', on_delete=models.CASCADE)
    subject = models.CharField(max_length=200)
    description = models.TextField()
    is_anonymous = models.BooleanField(default=False)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{'Anonymous' if self.is_anonymous else self.student.username} - {self.subject}"
