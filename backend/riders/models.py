from django.db import models
from django.contrib.auth.models import User

class Zone(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class MembershipApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    BLOOD_GROUP_CHOICES = [
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
    ]
    
    ID_DOCUMENT_CHOICES = [
        ('nid', 'National ID (NID)'),
        ('birth_certificate', 'Birth Certificate'),
        ('passport', 'Passport'),
    ]
    
    RIDING_EXPERIENCE_CHOICES = [
        ('beginner', 'Beginner (0-1 years)'),
        ('intermediate', 'Intermediate (1-5 years)'),
        ('advanced', 'Advanced (5+ years)'),
        ('expert', 'Expert (10+ years)'),    ]

    # Link to user account
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)

    # Personal Information
    profile_photo = models.ImageField(upload_to='applications/profile_photos/', null=True, blank=True)
    full_name = models.CharField(max_length=200)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20)
    alternative_phone = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField()
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES)
    profession = models.CharField(max_length=200)
    hobbies = models.TextField(blank=True, null=True)
    address = models.TextField()
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE)
    
    # Identity Verification
    id_document_type = models.CharField(max_length=20, choices=ID_DOCUMENT_CHOICES)
    id_document_number = models.CharField(max_length=50)
    id_document_photo = models.ImageField(upload_to='applications/id_documents/', null=True, blank=True)
    holding_id_photo = models.ImageField(upload_to='applications/holding_id/', null=True, blank=True)
    
    # Emergency Contact
    emergency_contact = models.CharField(max_length=200)
    emergency_phone = models.CharField(max_length=20)
    
    # Motorcycle Information
    has_motorbike = models.BooleanField(default=False)
    motorcycle_brand = models.CharField(max_length=100, blank=True, null=True)
    motorcycle_model = models.CharField(max_length=100, blank=True, null=True)
    motorcycle_year = models.IntegerField(blank=True, null=True)
    riding_experience = models.CharField(max_length=20, choices=RIDING_EXPERIENCE_CHOICES, default='beginner')
    
    # Terms and Application Status
    citizenship_confirm = models.BooleanField(default=False)
    agree_terms = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.full_name} - {self.status}"
    
    class Meta:
        ordering = ['-created_at']

class Rider(models.Model):
    MEMBERSHIP_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    bike_model = models.CharField(max_length=100, blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    membership_status = models.CharField(max_length=20, choices=MEMBERSHIP_STATUS_CHOICES, default='pending')
    zone = models.ForeignKey(Zone, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.bike_model}"

class RideEvent(models.Model):
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    date = models.DateField()
    time = models.TimeField()
    end_date = models.DateTimeField(blank=True, null=True, help_text="For multi-day events")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Event price in BDT")
    duration = models.CharField(max_length=100, blank=True, help_text="Event duration (e.g., '3 hours', '3 days, 2 nights')")
    requirements = models.TextField(blank=True, help_text="Requirements for the event")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    organizer = models.ForeignKey(Rider, on_delete=models.CASCADE, related_name='organized_events')
    organizer_name = models.CharField(max_length=200, blank=True, help_text="Organization/team name (e.g., 'Dhaka Zone Team')")
    participants = models.ManyToManyField(Rider, related_name='joined_events', blank=True)
    max_participants = models.IntegerField(default=20)
    photos = models.JSONField(default=list, blank=True, help_text="List of photo URLs for completed events")
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
    @property
    def current_joined(self):
        return self.participants.count()
    
    @property
    def is_upcoming(self):
        from django.utils import timezone
        today = timezone.now().date()
        return self.date >= today and self.status == 'upcoming'
    
    @property
    def is_past(self):
        from django.utils import timezone
        today = timezone.now().date()
        return self.date < today or self.status == 'completed'

    class Meta:
        ordering = ['date']

class EventPhoto(models.Model):
    """Model to store uploaded photos for events"""
    event = models.ForeignKey(RideEvent, on_delete=models.CASCADE, related_name='uploaded_photos')
    photo = models.ImageField(upload_to='event_photos/', help_text="Upload event photos")
    caption = models.CharField(max_length=200, blank=True, help_text="Optional caption for the photo")
    uploaded_by = models.ForeignKey(Rider, on_delete=models.SET_NULL, null=True, blank=True, help_text="Who uploaded this photo")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['uploaded_at']
        verbose_name = "Event Photo"
        verbose_name_plural = "Event Photos"
    
    def __str__(self):
        return f"Photo for {self.event.title} - {self.uploaded_at.strftime('%Y-%m-%d')}"

class Post(models.Model):
    author = models.ForeignKey(Rider, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='post_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(Rider, related_name='liked_posts', blank=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class BenefitCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, help_text="CSS class for icon (e.g., 'fas fa-discount', 'fas fa-gift')")
    color = models.CharField(max_length=7, default="#6366f1", help_text="Hex color code for category")
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0, help_text="Display order (lower numbers appear first)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = "Benefit Categories"

class Benefit(models.Model):
    MEMBERSHIP_LEVEL_CHOICES = [
        ('all', 'All Members'),
        ('basic', 'Basic Members'),
        ('premium', 'Premium Members'),
        ('vip', 'VIP Members'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(BenefitCategory, on_delete=models.CASCADE, related_name='benefits')
    image = models.ImageField(upload_to='benefits/', blank=True, null=True)
    membership_level = models.CharField(max_length=20, choices=MEMBERSHIP_LEVEL_CHOICES, default='all')
    
    # Partner/Vendor Information
    partner_name = models.CharField(max_length=200, blank=True)
    partner_logo = models.ImageField(upload_to='partner_logos/', blank=True, null=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, help_text="e.g., 15.50 for 15.5%")
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, help_text="Fixed discount amount")
    
    # Contact and Location
    contact_info = models.TextField(blank=True, help_text="Phone, email, website")
    location = models.TextField(blank=True, help_text="Address or multiple locations")
    website_url = models.URLField(blank=True)
    
    # Terms and Conditions
    terms_conditions = models.TextField(blank=True)
    valid_from = models.DateField(blank=True, null=True)
    valid_until = models.DateField(blank=True, null=True)
    usage_limit = models.IntegerField(blank=True, null=True, help_text="Maximum times a member can use this benefit")
    
    # Zones where benefit is available
    available_zones = models.ManyToManyField(Zone, blank=True, help_text="Leave empty for all zones")
    
    # Status and Display
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False, help_text="Show in featured benefits section")
    order = models.IntegerField(default=0, help_text="Display order (lower numbers appear first)")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.partner_name}"

    class Meta:
        ordering = ['order', '-created_at']

class BenefitUsage(models.Model):
    rider = models.ForeignKey('Rider', on_delete=models.CASCADE, related_name='benefit_usage')
    benefit = models.ForeignKey(Benefit, on_delete=models.CASCADE, related_name='usage_records')
    used_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, help_text="Additional notes about usage")

    def __str__(self):
        return f"{self.rider.user.username} used {self.benefit.title}"

    class Meta:
        ordering = ['-used_at']
