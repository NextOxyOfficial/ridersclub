from django.contrib import admin
from .models import Rider, RideEvent, Post, Zone

@admin.register(Zone)
class ZoneAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['is_active']
    ordering = ['name']

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
