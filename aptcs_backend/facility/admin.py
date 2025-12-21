from django.contrib import admin
from .models import Facility, Booking

@admin.register(Facility)
class FacilityAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'capacity')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'facility', 'start_time', 'end_time', 'status')
    list_filter = ('status', 'facility')
    actions = ['approve_booking', 'reject_booking']

    def approve_booking(self, request, queryset):
        queryset.update(status='approved')
    approve_booking.short_description = "Approve selected bookings"

    def reject_booking(self, request, queryset):
        queryset.update(status='rejected')
    reject_booking.short_description = "Reject selected bookings"
