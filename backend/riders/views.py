from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from django.contrib.auth.models import User
from .models import Rider, RideEvent, Post, Zone, MembershipApplication
from .serializers import RiderSerializer, RideEventSerializer, PostSerializer, ZoneSerializer, MembershipApplicationSerializer

class ZoneViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Zone.objects.filter(is_active=True)
    serializer_class = ZoneSerializer
    permission_classes = [AllowAny]

class MembershipApplicationViewSet(viewsets.ModelViewSet):
    queryset = MembershipApplication.objects.all()
    serializer_class = MembershipApplicationSerializer
    permission_classes = [AllowAny]  # Allow anonymous users to submit applications
    
    def get_queryset(self):
        # If user is admin, show all applications
        # Otherwise, show only their own (if authenticated)
        if self.request.user.is_staff:
            return MembershipApplication.objects.all()
        elif self.request.user.is_authenticated:
            return MembershipApplication.objects.filter(email=self.request.user.email)
        else:
            # For anonymous users, return empty queryset for list/retrieve
            return MembershipApplication.objects.none()
    
    def create(self, request, *args, **kwargs):
        """Handle application submission"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Validate required fields
            required_fields = [
                'full_name', 'phone', 'date_of_birth', 'blood_group', 'profession',
                'address', 'zone', 'id_document_type', 'id_document_number',
                'emergency_contact', 'emergency_phone', 'citizenship_confirm', 'agree_terms'
            ]
            
            for field in required_fields:
                if not serializer.validated_data.get(field):
                    return Response(
                        {'error': f'{field.replace("_", " ").title()} is required'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Additional validations
            if not serializer.validated_data.get('citizenship_confirm'):
                return Response(
                    {'error': 'You must confirm your Bangladesh citizenship'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not serializer.validated_data.get('agree_terms'):
                return Response(
                    {'error': 'You must agree to the terms and conditions'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Save the application
            application = serializer.save()
            
            return Response({
                'message': 'Application submitted successfully! We will contact you soon.',
                'application_id': application.id
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
