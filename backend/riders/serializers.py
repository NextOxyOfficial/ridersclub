from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Rider, RideEvent, Post, Zone, MembershipApplication, BenefitCategory, Benefit, BenefitUsage, EventPhoto, Notice

class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = ['id', 'name', 'description', 'is_active', 'created_at', 'updated_at']

class MembershipApplicationSerializer(serializers.ModelSerializer):
    zone_name = serializers.CharField(source='zone.name', read_only=True)
    
    class Meta:
        model = MembershipApplication
        fields = [
            'id', 'profile_photo', 'full_name', 'email', 'phone', 'alternative_phone',
            'date_of_birth', 'blood_group', 'profession', 'hobbies', 'address', 'zone',
            'zone_name', 'id_document_type', 'id_document_number', 'id_document_photo',
            'holding_id_photo', 'emergency_contact', 'emergency_phone', 'has_motorbike',
            'motorcycle_brand', 'motorcycle_model', 'motorcycle_year', 'riding_experience',
            'citizenship_confirm', 'agree_terms', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class RiderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Rider
        fields = ['id', 'user', 'bio', 'location', 'bike_model', 'profile_image', 'created_at', 'updated_at']

class EventPhotoSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.user.get_full_name', read_only=True)
    photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = EventPhoto
        fields = ['id', 'photo', 'photo_url', 'caption', 'uploaded_by', 'uploaded_by_name', 'uploaded_at']
    
    def get_photo_url(self, obj):
        if obj.photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.photo.url)
            return obj.photo.url
        return None

class RideEventSerializer(serializers.ModelSerializer):
    organizer = RiderSerializer(read_only=True)
    participants = RiderSerializer(many=True, read_only=True)
    uploaded_photos = EventPhotoSerializer(many=True, read_only=True)
    participant_count = serializers.SerializerMethodField()
    current_joined = serializers.ReadOnlyField()
    is_upcoming = serializers.ReadOnlyField()
    is_past = serializers.ReadOnlyField()
    can_join = serializers.SerializerMethodField()
    user_registered = serializers.SerializerMethodField()
    all_photos = serializers.SerializerMethodField()

    class Meta:
        model = RideEvent
        fields = ['id', 'title', 'description', 'location', 'date', 'time', 'end_date', 
                 'price', 'duration', 'requirements', 'status', 'organizer', 
                 'organizer_name', 'participants', 'participant_count', 'current_joined', 
                 'max_participants', 'photos', 'uploaded_photos', 'all_photos', 'is_featured', 'is_upcoming', 'is_past', 
                 'can_join', 'user_registered', 'created_at', 'updated_at']

    def get_participant_count(self, obj):
        return obj.participants.count()
    
    def get_can_join(self, obj):
        """Check if user can join this event"""
        if not obj.is_upcoming:
            return False
        if obj.current_joined >= obj.max_participants:
            return False
        return True
    
    def get_user_registered(self, obj):
        """Check if current user is registered for this event"""
        request = self.context.get('request')
        if request and hasattr(request.user, 'rider'):
            return obj.participants.filter(id=request.user.rider.id).exists()
        return False
    
    def get_all_photos(self, obj):
        """Combine legacy photo URLs and uploaded photos"""
        all_photos = []
        
        # Add legacy photo URLs
        for url in obj.photos:
            all_photos.append({
                'type': 'url',
                'url': url,
                'caption': '',
                'uploaded_at': None
            })
        
        # Add uploaded photos
        for photo in obj.uploaded_photos.all():
            photo_url = None
            if photo.photo:
                request = self.context.get('request')
                if request:
                    photo_url = request.build_absolute_uri(photo.photo.url)
                else:
                    photo_url = photo.photo.url
            
            all_photos.append({
                'type': 'upload',
                'url': photo_url,
                'caption': photo.caption or '',
                'uploaded_at': photo.uploaded_at,
                'uploaded_by': photo.uploaded_by.user.get_full_name() if photo.uploaded_by else None
            })
        
        return all_photos

class PostSerializer(serializers.ModelSerializer):
    author = RiderSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'author', 'title', 'content', 'image', 'likes_count', 'created_at', 'updated_at']

    def get_likes_count(self, obj):
        return obj.likes.count()

class BenefitCategorySerializer(serializers.ModelSerializer):
    benefits_count = serializers.SerializerMethodField()
    
    class Meta:
        model = BenefitCategory
        fields = ['id', 'name', 'description', 'icon', 'color', 'is_active', 'order', 'benefits_count', 'created_at', 'updated_at']
    
    def get_benefits_count(self, obj):
        return obj.benefits.filter(is_active=True).count()

class BenefitSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)
    available_zones_list = ZoneSerializer(source='available_zones', many=True, read_only=True)
    usage_count = serializers.SerializerMethodField()
    is_available_in_zone = serializers.SerializerMethodField()
    
    class Meta:
        model = Benefit
        fields = [
            'id', 'title', 'description', 'category', 'category_name', 'category_icon', 'category_color',
            'image', 'membership_level', 'partner_name', 'partner_logo', 'discount_percentage', 
            'discount_amount', 'contact_info', 'location', 'website_url', 'terms_conditions',
            'valid_from', 'valid_until', 'usage_limit', 'available_zones_list', 'is_active',
            'is_featured', 'order', 'usage_count', 'is_available_in_zone', 'created_at', 'updated_at'
        ]
    
    def get_usage_count(self, obj):
        return obj.usage_records.count()
    
    def get_is_available_in_zone(self, obj):
        # Check if benefit is available in user's zone
        request = self.context.get('request')
        if request and hasattr(request.user, 'rider'):
            user_zone = request.user.rider.zone
            if not obj.available_zones.exists():  # Available in all zones
                return True
            return obj.available_zones.filter(id=user_zone.id).exists() if user_zone else False
        return True  # Default for anonymous users

class BenefitUsageSerializer(serializers.ModelSerializer):
    rider_name = serializers.CharField(source='rider.user.get_full_name', read_only=True)
    benefit_title = serializers.CharField(source='benefit.title', read_only=True)
    partner_name = serializers.CharField(source='benefit.partner_name', read_only=True)
    
    class Meta:
        model = BenefitUsage
        fields = ['id', 'rider', 'rider_name', 'benefit', 'benefit_title', 'partner_name', 'used_at', 'notes']
        read_only_fields = ['id', 'used_at']

class NoticeSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    is_valid = serializers.ReadOnlyField()
    
    class Meta:
        model = Notice
        fields = [
            'id', 'title', 'message', 'priority', 'is_active', 'start_date', 
            'end_date', 'created_by', 'created_by_name', 'is_valid', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
