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
        ('expert', 'Expert (10+ years)'),
    ]

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
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    bike_model = models.CharField(max_length=100, blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.bike_model}"

class RideEvent(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    date = models.DateTimeField()
    organizer = models.ForeignKey(Rider, on_delete=models.CASCADE, related_name='organized_events')
    participants = models.ManyToManyField(Rider, related_name='joined_events', blank=True)
    max_participants = models.IntegerField(default=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['date']

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
