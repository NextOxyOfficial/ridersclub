from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta, time
from riders.models import RideEvent, Rider, Zone
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Create sample events for testing'

    def handle(self, *args, **options):
        # Get or create a default organizer
        try:
            admin_user = User.objects.get(is_superuser=True)
            if hasattr(admin_user, 'rider'):
                organizer = admin_user.rider
            else:
                # Create a rider profile for admin
                organizer = Rider.objects.create(
                    user=admin_user,
                    bio="System Administrator",
                    location="Dhaka"
                )
        except User.DoesNotExist:
            # Create admin user if doesn't exist
            admin_user = User.objects.create_superuser(
                username='admin',
                email='admin@ridersclub.com',
                password='admin123'
            )
            organizer = Rider.objects.create(
                user=admin_user,
                bio="System Administrator",
                location="Dhaka"
            )

        # Clear existing sample events
        RideEvent.objects.filter(title__in=[
            'Dhaka Night Ride',
            'Safety Workshop',
            "Cox's Bazar Tour",
            'Annual Club Meet 2024',
            'Chittagong Hill Ride',
            'Maintenance Workshop'
        ]).delete()

        # Create upcoming events
        upcoming_events = [
            {
                'title': 'Dhaka Night Ride',
                'description': 'Join us for an exciting night ride through the streets of Dhaka. Safety gear mandatory.',
                'location': 'Dhanmondi 27',
                'date': (timezone.now() + timedelta(days=7)).date(),
                'time': time(20, 0),  # 8:00 PM
                'price': 0.00,
                'duration': '3 hours',
                'difficulty': 'beginner',
                'requirements': 'Valid driving license\nSafety helmet (mandatory)\nReflective vest\nWorking headlight and taillight',
                'organizer_name': 'Dhaka Zone Team',
                'max_participants': 50,
                'status': 'upcoming'
            },
            {
                'title': 'Safety Workshop',
                'description': 'Learn essential riding safety tips and techniques from professional instructors.',
                'location': 'Club House',
                'date': (timezone.now() + timedelta(days=14)).date(),
                'time': time(14, 0),  # 2:00 PM
                'price': 500.00,
                'duration': '4 hours',
                'difficulty': 'beginner',
                'requirements': 'Own motorcycle for practical session\nSafety gear\nNotebook for taking notes',
                'organizer_name': 'Safety Committee',
                'max_participants': 30,
                'status': 'upcoming'
            },
            {
                'title': "Cox's Bazar Tour",
                'description': '3-day adventure tour to Cox\'s Bazar. Accommodation and meals included.',
                'location': "Cox's Bazar",
                'date': (timezone.now() + timedelta(days=28)).date(),
                'time': time(8, 0),  # 8:00 AM
                'end_date': timezone.now() + timedelta(days=30),
                'price': 15000.00,
                'duration': '3 days, 2 nights',
                'difficulty': 'intermediate',
                'requirements': 'Long-distance riding experience\nValid documents for travel\nPersonal medications\nCasual and riding gear',
                'organizer_name': 'Tour Committee',
                'max_participants': 25,
                'status': 'upcoming'
            }
        ]

        # Create past events
        past_events = [
            {
                'title': 'Annual Club Meet 2024',
                'description': 'Successful annual meetup with 150+ members. Great networking and fun activities.',
                'location': 'Dhaka Convention Center',
                'date': (timezone.now() - timedelta(days=30)).date(),
                'time': time(10, 0),  # 10:00 AM
                'price': 0.00,
                'duration': '6 hours',
                'difficulty': 'beginner',
                'requirements': 'Just bring yourself and enthusiasm!',
                'organizer_name': 'Event Committee',
                'max_participants': 200,
                'status': 'completed',
                'photos': [
                    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1517654978162-8321df66b51c?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=800&h=600&fit=crop'
                ]
            },
            {
                'title': 'Chittagong Hill Ride',
                'description': 'Amazing hill track adventure with scenic views and challenging routes.',
                'location': 'Chittagong Hill Tracts',
                'date': (timezone.now() - timedelta(days=45)).date(),
                'time': time(6, 0),  # 6:00 AM
                'price': 2500.00,
                'duration': '12 hours',
                'difficulty': 'advanced',
                'requirements': 'Advanced riding skills\nOff-road capable motorcycle\nFirst aid kit\nFull protective gear',
                'organizer_name': 'Adventure Club',
                'max_participants': 20,
                'status': 'completed',
                'photos': [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1464822759844-d150baec93c5?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=600&fit=crop'
                ]
            },
            {
                'title': 'Maintenance Workshop',
                'description': 'Hands-on motorcycle maintenance and repair workshop for all skill levels.',
                'location': 'Technical Training Center',
                'date': (timezone.now() - timedelta(days=60)).date(),
                'time': time(9, 0),  # 9:00 AM
                'price': 1000.00,
                'duration': '5 hours',
                'difficulty': 'intermediate',
                'requirements': 'Basic tools\nOwn motorcycle preferred\nWork clothes',
                'organizer_name': 'Technical Team',
                'max_participants': 15,
                'status': 'completed',
                'photos': []
            }
        ]

        # Create upcoming events
        for event_data in upcoming_events:
            event = RideEvent.objects.create(
                organizer=organizer,
                **event_data
            )
            self.stdout.write(
                self.style.SUCCESS(f'Created upcoming event: {event.title}')
            )

        # Create past events with participants
        for event_data in past_events:
            event = RideEvent.objects.create(
                organizer=organizer,
                **event_data
            )
            
            # Add some participants to past events
            if event.title == 'Annual Club Meet 2024':
                # Simulate 150 participants for the club meet
                event.participants.add(organizer)
            elif event.title == 'Chittagong Hill Ride':
                # Simulate 45 participants for hill ride
                event.participants.add(organizer)
            elif event.title == 'Maintenance Workshop':
                # Simulate 80 participants for workshop
                event.participants.add(organizer)
            
            self.stdout.write(
                self.style.SUCCESS(f'Created past event: {event.title}')
            )

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {len(upcoming_events) + len(past_events)} sample events')
        )
