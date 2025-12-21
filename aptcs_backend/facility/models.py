from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

class Facility(models.Model):
    FACILITY_TYPES = (
        ('auditorium', 'Auditorium'),
        ('lab', 'Laboratory'),
        ('ground', 'Sports Ground'),
        ('classroom', 'Classroom'),
    )
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=FACILITY_TYPES)
    capacity = models.IntegerField()
    image = models.ImageField(upload_to='facilities/', blank=True, null=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    facility = models.ForeignKey(Facility, related_name='bookings', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='bookings', on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    purpose = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        # Check for overlaps
        overlapping_bookings = Booking.objects.filter(
            facility=self.facility,
            start_time__lt=self.end_time,
            end_time__gt=self.start_time,
            status='approved' # Only check against approved bookings? Or pending too? Let's check approved for hard conflict, warning for pending. 
                              # For simplicity/strictness, let's assume if it overlaps with an APPROVED booking, it's invalid.
        ).exclude(pk=self.pk)

        if overlapping_bookings.exists():
            raise ValidationError("This facility is already booked for the selected time slot.")
        
        if self.start_time >= self.end_time:
             raise ValidationError("End time must be after start time.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.facility.name} ({self.start_time})"
