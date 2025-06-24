from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from django.contrib.auth.models import User
from django.utils import timezone
from django.db import models
from .models import Rider, RideEvent, Post, Zone, MembershipApplication, BenefitCategory, Benefit, BenefitUsage, Notice
from .serializers import RiderSerializer, RideEventSerializer, PostSerializer, ZoneSerializer, MembershipApplicationSerializer, BenefitCategorySerializer, BenefitSerializer, BenefitUsageSerializer, NoticeSerializer

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
        elif self.request.user.is_authenticated:            return MembershipApplication.objects.filter(email=self.request.user.email)
        else:
            # For anonymous users, return empty queryset for list/retrieve
            return MembershipApplication.objects.none()
    
    def create(self, request, *args, **kwargs):
        """Handle application submission with user creation"""
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
            
            # Password validation
            password = request.data.get('password')
            if not password:
                return Response(
                    {'error': 'Password is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if len(password) < 8:
                return Response(
                    {'error': 'Password must be at least 8 characters long'},
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
            
            # Check if user with this phone already exists
            phone = serializer.validated_data.get('phone')
            if User.objects.filter(username=phone).exists():
                return Response(
                    {'error': 'A user with this phone number already exists'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create user account
            try:
                user = User.objects.create_user(
                    username=phone,
                    email=serializer.validated_data.get('email', ''),
                    password=password,
                    first_name=serializer.validated_data.get('full_name', '').split()[0] if serializer.validated_data.get('full_name') else '',
                    last_name=' '.join(serializer.validated_data.get('full_name', '').split()[1:]) if len(serializer.validated_data.get('full_name', '').split()) > 1 else ''
                )
                
                # Create Rider profile
                rider = Rider.objects.create(
                    user=user,
                    membership_status='pending',
                    zone_id=serializer.validated_data.get('zone').id if serializer.validated_data.get('zone') else None
                )
                
                # Save the application and link to user
                application = serializer.save(user=user)
                
                return Response({
                    'message': 'Account created and application submitted successfully! You can now login with your phone number and password.',
                    'application_id': application.id,
                    'user_id': user.id
                }, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                return Response(
                    {'error': f'Error creating user account: {str(e)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RiderViewSet(viewsets.ModelViewSet):
    queryset = Rider.objects.all()
    serializer_class = RiderSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Rider.objects.select_related('user')

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        """Get featured riders (team controllers) for Help & Support"""
        featured_riders = Rider.objects.filter(
            is_featured=True,
            membership_status='approved'
        ).select_related('user').order_by('user__first_name')
        
        riders_data = []
        for rider in featured_riders:
            profile_photo_url = None
            if rider.profile_image:
                profile_photo_url = request.build_absolute_uri(rider.profile_image.url)
            
            riders_data.append({
                'id': rider.id,
                'user_id': rider.user.id,
                'full_name': f"{rider.user.first_name} {rider.user.last_name}".strip() or rider.user.username,
                'custom_user_type': rider.custom_user_type or 'Team Controller',
                'profile_photo': profile_photo_url,
                'bio': rider.bio,
                'location': rider.location,
                'zone': {
                    'id': rider.zone.id,
                    'name': rider.zone.name
                } if rider.zone else None,
            })
        
        return Response(riders_data)

class RideEventViewSet(viewsets.ModelViewSet):
    queryset = RideEvent.objects.all()
    serializer_class = RideEventSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = RideEvent.objects.select_related('organizer__user').prefetch_related('participants__user')
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by upcoming/past
        event_type = self.request.query_params.get('type', None)
        if event_type == 'upcoming':
            from django.utils import timezone
            today = timezone.now().date()
            queryset = queryset.filter(date__gte=today, status='upcoming')
        elif event_type == 'past':
            from django.utils import timezone
            today = timezone.now().date()
            queryset = queryset.filter(
                models.Q(date__lt=today) | models.Q(status='completed')
            )
        
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming events"""
        from django.utils import timezone
        today = timezone.now().date()
        events = RideEvent.objects.filter(
            date__gte=today, 
            status='upcoming'
        ).select_related('organizer__user').prefetch_related('participants__user')
        
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def past(self, request):
        """Get past/completed events"""
        from django.utils import timezone
        today = timezone.now().date()
        events = RideEvent.objects.filter(
            models.Q(date__lt=today) | models.Q(status='completed')
        ).select_related('organizer__user').prefetch_related('participants__user')
        
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        event = self.get_object()
        
        # Check if user has a rider profile
        if not hasattr(request.user, 'rider'):
            return Response({'error': 'Rider profile required'}, status=status.HTTP_400_BAD_REQUEST)
        
        rider = request.user.rider
        
        # Check if event is upcoming
        if not event.is_upcoming:
            return Response({'error': 'Cannot join past or non-upcoming events'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check capacity
        if event.participants.count() >= event.max_participants:
            return Response({'error': 'Event is full'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if already joined
        if rider in event.participants.all():
            return Response({'error': 'Already joined this event'}, status=status.HTTP_400_BAD_REQUEST)
        
        event.participants.add(rider)
        return Response({
            'message': 'Successfully joined the event',
            'current_joined': event.current_joined
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def leave(self, request, pk=None):
        event = self.get_object()
        
        # Check if user has a rider profile
        if not hasattr(request.user, 'rider'):
            return Response({'error': 'Rider profile required'}, status=status.HTTP_400_BAD_REQUEST)
        
        rider = request.user.rider
        
        # Check if joined
        if rider not in event.participants.all():
            return Response({'error': 'Not joined this event'}, status=status.HTTP_400_BAD_REQUEST)
        
        event.participants.remove(rider)
        return Response({
            'message': 'Successfully left the event',
            'current_joined': event.current_joined
        })

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

class BenefitCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BenefitCategory.objects.filter(is_active=True)
    serializer_class = BenefitCategorySerializer
    permission_classes = [AllowAny]

class BenefitViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Benefit.objects.filter(is_active=True)
    serializer_class = BenefitSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Benefit.objects.filter(is_active=True).select_related('category').prefetch_related('available_zones')
        
        # Filter by category if specified
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__id=category)
        
        # Filter by membership level if user is authenticated
        if self.request.user.is_authenticated and hasattr(self.request.user, 'rider'):
            membership_level = getattr(self.request.user.rider, 'membership_level', 'basic')
            # For now, show all benefits. In future, you can implement membership levels
            pass
        
        # Filter by zone if user is authenticated
        if self.request.user.is_authenticated and hasattr(self.request.user, 'rider'):
            user_zone = self.request.user.rider.zone
            if user_zone:
                # Show benefits available in user's zone or available in all zones
                queryset = queryset.filter(
                    models.Q(available_zones__isnull=True) | 
                    models.Q(available_zones=user_zone)
                ).distinct()
        
        # Filter by featured if specified
        featured = self.request.query_params.get('featured', None)
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)
        
        # Filter by valid date range
        today = timezone.now().date()
        queryset = queryset.filter(
            models.Q(valid_from__isnull=True) | models.Q(valid_from__lte=today),
            models.Q(valid_until__isnull=True) | models.Q(valid_until__gte=today)
        )
        
        return queryset.order_by('order', '-created_at')

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured benefits"""
        featured_benefits = self.get_queryset().filter(is_featured=True)[:6]
        serializer = self.get_serializer(featured_benefits, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get benefits grouped by category"""
        categories = BenefitCategory.objects.filter(is_active=True, benefits__is_active=True).distinct()
        result = []
        
        for category in categories:
            category_benefits = self.get_queryset().filter(category=category)[:4]
            result.append({
                'category': BenefitCategorySerializer(category).data,
                'benefits': BenefitSerializer(category_benefits, many=True, context={'request': request}).data
            })
        
        return Response(result)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def use_benefit(self, request, pk=None):
        """Record benefit usage"""
        benefit = self.get_object()
        
        if not hasattr(request.user, 'rider'):
            return Response(
                {'error': 'You must be a registered rider to use benefits'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        rider = request.user.rider
        
        # Check usage limit
        if benefit.usage_limit:
            usage_count = BenefitUsage.objects.filter(rider=rider, benefit=benefit).count()
            if usage_count >= benefit.usage_limit:
                return Response(
                    {'error': f'You have already used this benefit {benefit.usage_limit} times'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Check if benefit is still valid
        today = timezone.now().date()
        if benefit.valid_until and benefit.valid_until < today:
            return Response(
                {'error': 'This benefit has expired'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if benefit.valid_from and benefit.valid_from > today:
            return Response(
                {'error': 'This benefit is not yet available'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Record usage
        usage = BenefitUsage.objects.create(
            rider=rider,
            benefit=benefit,
            notes=request.data.get('notes', '')
        )
        
        return Response({
            'message': 'Benefit usage recorded successfully',
            'usage': BenefitUsageSerializer(usage).data
        })

class BenefitUsageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BenefitUsage.objects.all()
    serializer_class = BenefitUsageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if hasattr(self.request.user, 'rider'):
            return BenefitUsage.objects.filter(rider=self.request.user.rider).select_related('benefit', 'rider__user')
        return BenefitUsage.objects.none()

class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # For regular users, only show active and valid notices
        if not self.request.user.is_staff:
            now = timezone.now()
            return Notice.objects.filter(
                is_active=True,
                start_date__lte=now
            ).filter(
                models.Q(end_date__isnull=True) | models.Q(end_date__gt=now)
            )
        # For staff users, show all notices
        return Notice.objects.all()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def create(self, request, *args, **kwargs):
        # Only staff can create notices
        if not request.user.is_staff:
            return Response(
                {'detail': 'Permission denied. Only staff can create notices.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        # Only staff can update notices
        if not request.user.is_staff:
            return Response(
                {'detail': 'Permission denied. Only staff can update notices.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        # Only staff can delete notices
        if not request.user.is_staff:
            return Response(
                {'detail': 'Permission denied. Only staff can delete notices.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def active(self, request):
        """Get only active and valid notices for the notice slider"""
        now = timezone.now()
        notices = Notice.objects.filter(
            is_active=True,
            start_date__lte=now
        ).filter(
            models.Q(end_date__isnull=True) | models.Q(end_date__gt=now)
        ).order_by('-priority', '-created_at')
        
        serializer = self.get_serializer(notices, many=True)
        return Response(serializer.data)
