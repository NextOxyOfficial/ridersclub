from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Rider, RideEvent, Post, Zone, MembershipApplication

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

    class Meta:
        model = RideEvent
        fields = ['id', 'title', 'description', 'location', 'date', 'organizer', 
                 'participants', 'participant_count', 'max_participants', 'created_at', 'updated_at']

    def get_participant_count(self, obj):
        return obj.participants.count()

class PostSerializer(serializers.ModelSerializer):
    author = RiderSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'author', 'title', 'content', 'image', 'likes_count', 'created_at', 'updated_at']

    def get_likes_count(self, obj):
        return obj.likes.count()
