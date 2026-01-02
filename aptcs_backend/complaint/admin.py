from django.contrib import admin
from .models import Complaint

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('subject', 'student_display', 'is_anonymous', 'status', 'created_at')
    list_filter = ('status', 'is_anonymous')
    actions = ['mark_resolved', 'mark_dismissed']

    def student_display(self, obj):
        return "Anonymous" if obj.is_anonymous else obj.student.username
    student_display.short_description = 'Student'

    def mark_resolved(self, request, queryset):
        queryset.update(status='resolved')
    mark_resolved.short_description = "Mark selected complaints as Resolved"

    def mark_dismissed(self, request, queryset):
        queryset.update(status='dismissed')
    mark_dismissed.short_description = "Mark selected complaints as Dismissed"
