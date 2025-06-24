from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Rider, RideEvent, Post, Zone, MembershipApplication, BenefitCategory, Benefit, BenefitUsage

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

class RideEventSerializer(serializers.ModelSerializer):
    organizer = RiderSerializer(read_only=True)
    participants = RiderSerializer(many=True, read_only=True)
    participant_count = serializers.SerializerMethodField()
    current_joined = serializers.ReadOnlyField()
    is_upcoming = serializers.ReadOnlyField()
    is_past = serializers.ReadOnlyField()
    can_join = serializers.SerializerMethodField()
    user_registered = serializers.SerializerMethodField()

    class Meta:
        model = RideEvent
        fields = ['id', 'title', 'description', 'location', 'date', 'time', 'end_date', 
                 'price', 'duration', 'difficulty', 'requirements', 'status', 'organizer', 
                 'organizer_name', 'participants', 'participant_count', 'current_joined', 
                 'max_participants', 'photos', 'is_featured', 'is_upcoming', 'is_past', 
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
