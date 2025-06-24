# Generated manually for is_featured field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('riders', '0011_merge_0010_add_custom_user_type_0010_notice'),
    ]

    operations = [
        migrations.AddField(
            model_name='rider',
            name='is_featured',
            field=models.BooleanField(default=False, help_text='Mark this rider as a featured team controller'),
        ),
    ]
