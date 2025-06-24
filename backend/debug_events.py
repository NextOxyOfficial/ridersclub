#!/usr/bin/env python
import os
import django
import sys
import traceback

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ridersclub_backend.settings')
django.setup()

try:
    from riders.models import RideEvent
    from riders.serializers import RideEventSerializer
    
    print("Testing RideEvent model and serializer...")
    
    # Test basic model access
    events = RideEvent.objects.all()
    print(f"Found {events.count()} events")
    
    if events.exists():
        # Test first event
        event = events.first()
        print(f"First event: {event.title}")
        print(f"Date: {event.date}, Time: {event.time}")
        print(f"Status: {event.status}")
        print(f"Organizer: {event.organizer}")
        
        # Test serialization
        print("\nTesting serialization...")
        serializer = RideEventSerializer(event)
        print("Serializer created successfully")
        
        # Test data access
        data = serializer.data
        print("Data access successful")
        print(f"Serialized data keys: {list(data.keys())}")
        
        # Test queryset serialization (what the API would do)
        print("\nTesting queryset serialization...")
        queryset = RideEvent.objects.select_related('organizer__user').prefetch_related('participants__user')
        serializer = RideEventSerializer(queryset, many=True)
        data = serializer.data
        print(f"Queryset serialization successful: {len(data)} events")
        
    else:
        print("No events found in database")
        
except Exception as e:
    print(f"Error occurred: {e}")
    traceback.print_exc()
