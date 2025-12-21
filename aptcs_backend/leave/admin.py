from django.contrib import admin
from .models import LeaveRequest

@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = ('student', 'start_date', 'end_date', 'status')
    list_filter = ('status',)
    actions = ['approve_leave', 'reject_leave']

    def approve_leave(self, request, queryset):
        queryset.update(status='approved')
    approve_leave.short_description = "Approve selected leaves"

    def reject_leave(self, request, queryset):
        queryset.update(status='rejected')
    reject_leave.short_description = "Reject selected leaves"
