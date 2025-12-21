from rest_framework import serializers
from .models import Facility, Booking

class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    facility_name = serializers.ReadOnlyField(source='facility.name')
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Booking
        fields = ['id', 'facility', 'facility_name', 'user', 'username', 'start_time', 'end_time', 'purpose', 'status', 'created_at']
        read_only_fields = ['user', 'status', 'created_at']

    def validate(self, data):
        # We also need to validate overlaps here if not handled by model.save() or if we want better error messages
        # Model.clean() is called by full_clean(), which DRF calls automatically in some cases, but good to be explicit or let model handle it.
        # However, DRF serializers don't automatically call model.clean(). We should call it or replicate logic.
        
        # Replicating logic/Calling model clean manually on an instance created from data
        # But data doesn't have all fields yet.
        
        # Simplest: Check overlap manually here
        facility = data.get('facility')
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError("End time must be after start time.")
        
        if facility and start_time and end_time:
             overlapping = Booking.objects.filter(
                facility=facility,
                start_time__lt=end_time,
                end_time__gt=start_time,
                status='approved'
            )
             if self.instance: # Exclude self on update
                 overlapping = overlapping.exclude(pk=self.instance.pk)
            
             if overlapping.exists():
                 raise serializers.ValidationError("Facility is already booked for this time slot.")

        return data
