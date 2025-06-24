from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
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
                'full_description': 'Experience the thrill of riding through Dhaka\'s illuminated streets at night. This guided tour will take you through the most scenic and safe routes in the city. We\'ll start from Dhanmondi and make our way through key landmarks including Rabindra Sarobar, TSC, and the Parliament area. Professional marshals will ensure safety throughout the journey.',
                'location': 'Dhanmondi 27',
                'date': timezone.now() + timedelta(days=7),  # Next week
                'price': 'Free',
                'duration': '3 hours',
                'difficulty': 'beginner',
                'requirements': [
                    'Valid driving license',
                    'Safety helmet (mandatory)',
                    'Reflective vest',
                    'Working headlight and taillight'
                ],
                'organizer_name': 'Dhaka Zone Team',
                'max_participants': 50,
                'status': 'upcoming'
            },
            {
                'title': 'Safety Workshop',
                'description': 'Learn essential riding safety tips and techniques from professional instructors.',
                'full_description': 'A comprehensive workshop covering all aspects of motorcycle safety. Learn from certified instructors about defensive riding techniques, emergency braking, cornering safety, and road hazard awareness. The workshop includes both theoretical sessions and practical demonstrations.',
                'location': 'Club House',
                'date': timezone.now() + timedelta(days=14),  # In 2 weeks
                'price': '৳500',
                'duration': '4 hours',
                'difficulty': 'beginner',
                'requirements': [
                    'Own motorcycle for practical session',
                    'Safety gear',
                    'Notebook for taking notes'
                ],
                'organizer_name': 'Safety Committee',
                'max_participants': 30,
                'status': 'upcoming'
            },
            {
                'title': "Cox's Bazar Tour",
                'description': '3-day adventure tour to Cox\'s Bazar. Accommodation and meals included.',
                'full_description': 'An unforgettable 3-day motorcycle tour to the world\'s longest natural sea beach. The package includes accommodation at a beachfront resort, all meals, guided tours to local attractions, and support vehicle throughout the journey. Experience the beauty of Cox\'s Bazar, visit Inani Beach, and enjoy group bonding activities.',
                'location': "Cox's Bazar",
                'date': timezone.now() + timedelta(days=28),  # In 4 weeks
                'end_date': timezone.now() + timedelta(days=30),  # 3-day event
                'price': '৳15,000',
                'duration': '3 days, 2 nights',
                'difficulty': 'intermediate',
                'requirements': [
                    'Long-distance riding experience',
                    'Valid documents for travel',
                    'Personal medications',
                    'Casual and riding gear'
                ],
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
                'full_description': 'Our biggest annual gathering bringing together riders from all zones. Featured group rides, technical workshops, vendor showcases, and networking opportunities. A great success with record attendance.',
                'location': 'Dhaka Convention Center',
                'date': timezone.now() - timedelta(days=30),  # 1 month ago
                'price': 'Free',
                'duration': '1 day',
                'difficulty': 'beginner',
                'requirements': ['Valid membership'],
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
                'full_description': 'A thrilling ride through the hills of Chittagong with breathtaking views and challenging terrain. Perfect for experienced riders looking for adventure.',
                'location': 'Chittagong Hill Tracts',
                'date': timezone.now() - timedelta(days=60),  # 2 months ago
                'price': '৳2,000',
                'duration': '2 days',
                'difficulty': 'advanced',
                'requirements': [
                    'Advanced riding experience',
                    'Off-road capable motorcycle',
                    'Camping gear'
                ],
                'organizer_name': 'Adventure Team',
                'max_participants': 45,
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
                'full_description': 'Learn basic to advanced motorcycle maintenance techniques. Covered topics include engine care, brake maintenance, chain adjustment, and troubleshooting common issues.',
                'location': 'Technical Center',
                'date': timezone.now() - timedelta(days=90),  # 3 months ago
                'price': '৳800',
                'duration': '6 hours',
                'difficulty': 'intermediate',
                'requirements': [
                    'Basic tools',
                    'Work clothes',
                    'Motorcycle for practice'
                ],
                'organizer_name': 'Technical Team',
                'max_participants': 80,
                'status': 'completed',
                'photos': []
            }
        ]

        # Create events
        created_events = []
        
        for event_data in upcoming_events + past_events:
            event = RideEvent.objects.create(
                organizer=organizer,
                **event_data
            )
            created_events.append(event)
            
            # Add some participants to past events
            if event.status == 'completed':
                # Simulate attendance - add organizer as participant
                event.participants.add(organizer)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {len(created_events)} sample events:\n' +
                '\n'.join([f'- {event.title}' for event in created_events])
            )
        )
