# Generated manually for custom_user_type field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('riders', '0009_add_event_photo_model'),
    ]

    operations = [
        migrations.AddField(
            model_name='rider',
            name='custom_user_type',
            field=models.CharField(blank=True, help_text="Custom user type/title (e.g., 'Adventure Rider', 'Speed Enthusiast', etc.)", max_length=100),
        ),
    ]
