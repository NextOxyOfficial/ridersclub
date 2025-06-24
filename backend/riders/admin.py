from django.contrib import admin
from .models import Rider, RideEvent, Post, Zone, MembershipApplication, BenefitCategory, Benefit, BenefitUsage, EventPhoto

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

class EventPhotoInline(admin.TabularInline):
    model = EventPhoto
    extra = 3
    fields = ('photo', 'caption', 'uploaded_by')
    readonly_fields = ('uploaded_at',)

@admin.register(RideEvent)
class RideEventAdmin(admin.ModelAdmin):
    list_display = ['title', 'organizer', 'date', 'location', 'participant_count', 'photo_count']
    list_filter = ['date', 'location', 'status']
    search_fields = ['title', 'organizer__user__username', 'organizer_name']
    inlines = [EventPhotoInline]
    
    fieldsets = (
        ('Event Information', {
            'fields': ('title', 'description', 'location', 'organizer', 'organizer_name')
        }),
        ('Date & Time', {
            'fields': ('date', 'time', 'end_date', 'duration')
        }),
        ('Event Details', {
            'fields': ('price', 'requirements', 'max_participants', 'status', 'is_featured')
        }),
        ('Legacy Photos (URLs)', {
            'fields': ('photos',),
            'description': 'Legacy photo URLs - use the Photos section below for file uploads',
            'classes': ('collapse',)
        }),
    )
    
    def participant_count(self, obj):
        return obj.participants.count()
    participant_count.short_description = 'Participants'
    
    def photo_count(self, obj):
        return obj.uploaded_photos.count()
    photo_count.short_description = 'Uploaded Photos'

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'created_at', 'likes_count']
    list_filter = ['created_at']
    search_fields = ['title', 'author__user__username']
    
    def likes_count(self, obj):
        return obj.likes.count()
    likes_count.short_description = 'Likes'

@admin.register(BenefitCategory)
class BenefitCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'color', 'is_active', 'order', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['is_active', 'order']
    ordering = ['order', 'name']
    
    fieldsets = (
        ('Category Information', {
            'fields': ('name', 'description', 'is_active', 'order')
        }),
        ('Display Settings', {
            'fields': ('icon', 'color')
        }),
    )

@admin.register(Benefit)
class BenefitAdmin(admin.ModelAdmin):
    list_display = ['title', 'partner_name', 'category', 'membership_level', 'discount_percentage', 'is_active', 'is_featured', 'order', 'created_at']
    list_filter = ['category', 'membership_level', 'is_active', 'is_featured', 'available_zones', 'created_at']
    search_fields = ['title', 'partner_name', 'description']
    list_editable = ['is_active', 'is_featured', 'order']
    filter_horizontal = ['available_zones']
    ordering = ['order', '-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'category', 'image')
        }),
        ('Partner Information', {
            'fields': ('partner_name', 'partner_logo', 'contact_info', 'location', 'website_url')
        }),
        ('Discount Details', {
            'fields': ('discount_percentage', 'discount_amount', 'membership_level')
        }),
        ('Terms & Availability', {
            'fields': ('terms_conditions', 'valid_from', 'valid_until', 'usage_limit', 'available_zones')
        }),
        ('Display Settings', {
            'fields': ('is_active', 'is_featured', 'order')
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('category').prefetch_related('available_zones')

@admin.register(BenefitUsage)
class BenefitUsageAdmin(admin.ModelAdmin):
    list_display = ['rider', 'benefit', 'used_at', 'notes']
    list_filter = ['used_at', 'benefit__category', 'benefit__partner_name']
    search_fields = ['rider__user__username', 'benefit__title', 'benefit__partner_name']
    readonly_fields = ['used_at']
    ordering = ['-used_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('rider__user', 'benefit')

@admin.register(EventPhoto)
class EventPhotoAdmin(admin.ModelAdmin):
    list_display = ['event', 'caption', 'uploaded_by', 'uploaded_at']
    list_filter = ['uploaded_at', 'event__status']
    search_fields = ['event__title', 'caption', 'uploaded_by__user__username']
    readonly_fields = ['uploaded_at']
    
    fieldsets = (
        ('Photo Information', {
            'fields': ('event', 'photo', 'caption')
        }),
        ('Upload Details', {
            'fields': ('uploaded_by', 'uploaded_at')
        }),
    )
