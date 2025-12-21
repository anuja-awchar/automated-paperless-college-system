from django.db import models
from django.conf import settings

class LeaveRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    student = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='leave_requests', on_delete=models.CASCADE)
    reason = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    document = models.FileField(upload_to='leave_documents/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.username} - {self.reason[:20]}"
