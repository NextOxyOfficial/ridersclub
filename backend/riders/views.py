from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.contrib.auth.models import User
from .models import Rider, RideEvent, Post, Zone
from .serializers import RiderSerializer, RideEventSerializer, PostSerializer, ZoneSerializer

class ZoneViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Zone.objects.filter(is_active=True)
    serializer_class = ZoneSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RiderViewSet(viewsets.ModelViewSet):
    queryset = Rider.objects.all()
    serializer_class = RiderSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Rider.objects.select_related('user')

class RideEventViewSet(viewsets.ModelViewSet):
    queryset = RideEvent.objects.all()
    serializer_class = RideEventSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return RideEvent.objects.select_related('organizer__user').prefetch_related('participants__user')

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        event = self.get_object()
        rider = request.user.rider
        
        if event.participants.count() >= event.max_participants:
            return Response({'error': 'Event is full'}, status=status.HTTP_400_BAD_REQUEST)
        
        if rider in event.participants.all():
            return Response({'error': 'Already joined this event'}, status=status.HTTP_400_BAD_REQUEST)
        
        event.participants.add(rider)
        return Response({'message': 'Successfully joined the event'})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def leave(self, request, pk=None):
        event = self.get_object()
        rider = request.user.rider
        
        if rider not in event.participants.all():
            return Response({'error': 'Not joined this event'}, status=status.HTTP_400_BAD_REQUEST)
        
        event.participants.remove(rider)
        return Response({'message': 'Successfully left the event'})

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Post.objects.select_related('author__user').prefetch_related('likes__user')

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        post = self.get_object()
        rider = request.user.rider
        
        if rider in post.likes.all():
            post.likes.remove(rider)
            liked = False
        else:
            post.likes.add(rider)
            liked = True
        
        return Response({
            'liked': liked,
            'likes_count': post.likes.count()
        })
