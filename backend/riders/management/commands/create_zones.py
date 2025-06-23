from django.core.management.base import BaseCommand
from riders.models import Zone

class Command(BaseCommand):
    help = 'Create initial zones for Bangladesh'

    def handle(self, *args, **options):
        zones_data = [
            {'name': 'Dhaka North', 'description': 'Northern part of Dhaka city'},
            {'name': 'Dhaka South', 'description': 'Southern part of Dhaka city'},
            {'name': 'Chittagong', 'description': 'Port city of Bangladesh'},
            {'name': 'Sylhet', 'description': 'Tea capital of Bangladesh'},
            {'name': 'Rajshahi', 'description': 'Silk city of Bangladesh'},
            {'name': 'Khulna', 'description': 'Industrial city near Sundarbans'},
            {'name': 'Barisal', 'description': 'Venice of Bengal'},
            {'name': 'Rangpur', 'description': 'Northern division of Bangladesh'},
            {'name': 'Mymensingh', 'description': 'Educational hub of Bangladesh'},
            {'name': 'Comilla', 'description': 'Historical city of Bangladesh'},
            {'name': "Cox's Bazar", 'description': 'Longest sea beach in the world'},
            {'name': 'Gazipur', 'description': 'Industrial city near Dhaka'},
            {'name': 'Narayanganj', 'description': 'Jute city of Bangladesh'},
            {'name': 'Jessore', 'description': 'Gateway to Bangladesh'},
            {'name': 'Bogura', 'description': 'Archaeological city'},
            {'name': 'Dinajpur', 'description': 'Northern district'},
            {'name': 'Kushtia', 'description': 'Cultural hub'},
            {'name': 'Faridpur', 'description': 'River port city'},
        ]

        for zone_data in zones_data:
            zone, created = Zone.objects.get_or_create(
                name=zone_data['name'],
                defaults={'description': zone_data['description']}
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created zone: {zone.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Zone already exists: {zone.name}')
                )

        self.stdout.write(
            self.style.SUCCESS('Zones creation completed!')
        )
