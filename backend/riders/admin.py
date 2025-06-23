from django.contrib import admin
from .models import Rider, RideEvent, Post, Zone, MembershipApplication

@admin.register(Zone)
class ZoneAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['is_active']
    ordering = ['name']

@admin.register(MembershipApplication)
class MembershipApplicationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'phone', 'zone', 'status', 'has_motorbike', 'created_at']
    list_filter = ['status', 'zone', 'has_motorbike', 'blood_group', 'id_document_type', 'created_at']
    search_fields = ['full_name', 'email', 'phone', 'id_document_number']
    list_editable = ['status']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('profile_photo', 'full_name', 'email', 'phone', 'alternative_phone', 
                      'date_of_birth', 'blood_group', 'profession', 'hobbies', 'address', 'zone')
        }),
        ('Identity Verification', {
            'fields': ('id_document_type', 'id_document_number', 'id_document_photo', 'holding_id_photo')
        }),
        ('Emergency Contact', {
            'fields': ('emergency_contact', 'emergency_phone')
        }),
        ('Motorcycle Information', {
            'fields': ('has_motorbike', 'motorcycle_brand', 'motorcycle_model', 'motorcycle_year', 'riding_experience')
        }),
        ('Application Status', {
            'fields': ('citizenship_confirm', 'agree_terms', 'status', 'created_at', 'updated_at')
        }),
    )

@admin.register(Rider)
class RiderAdmin(admin.ModelAdmin):
    list_display = ['user', 'bike_model', 'location', 'created_at']
    list_filter = ['created_at', 'location']
    search_fields = ['user__username', 'user__email', 'bike_model']

@admin.register(RideEvent)
class RideEventAdmin(admin.ModelAdmin):
    list_display = ['title', 'organizer', 'date', 'location', 'participant_count']
    list_filter = ['date', 'location']
    search_fields = ['title', 'organizer__user__username']
    
    def participant_count(self, obj):
        return obj.participants.count()
    participant_count.short_description = 'Participants'

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'created_at', 'likes_count']
    list_filter = ['created_at']
    search_fields = ['title', 'author__user__username']
    
    def likes_count(self, obj):
        return obj.likes.count()
    likes_count.short_description = 'Likes'
