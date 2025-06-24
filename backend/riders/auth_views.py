from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Rider, Zone, MembershipApplication
from .serializers import RiderSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Login with phone number and password
    """
    phone = request.data.get('phone')
    password = request.data.get('password')
    
    if not phone or not password:
        return Response(
            {'detail': 'Phone number and password are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Normalize phone number - try both formats
    phone_formats = []
    if phone.startswith('+880'):
        # Convert +8801XXXXXXXXX to 01XXXXXXXXX
        local_format = '0' + phone[4:]
        phone_formats = [phone, local_format]
    elif phone.startswith('01'):
        # Convert 01XXXXXXXXX to +8801XXXXXXXXX
        international_format = '+880' + phone[1:]
        phone_formats = [phone, international_format]
    else:
        phone_formats = [phone]
    
    # Find user by phone (try both formats)
    user = None
    for phone_format in phone_formats:
        try:
            user = User.objects.get(username=phone_format)
            break
        except User.DoesNotExist:
            continue
    
    if not user:
        return Response(
            {'detail': 'Invalid credentials'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Authenticate user
    user = authenticate(username=user.username, password=password)
    if not user:
        return Response(
            {'detail': 'Invalid credentials'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Generate tokens
    refresh = RefreshToken.for_user(user)
    access_token = refresh.access_token
    
    # Get user profile data
    try:
        rider = Rider.objects.get(user=user)
        membership_status = rider.membership_status
        zone = rider.zone
    except Rider.DoesNotExist:
        membership_status = 'pending'
        zone = None
    
    return Response({
        'access': str(access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'phone': user.username,
            'full_name': f"{user.first_name} {user.last_name}".strip() or user.username,
            'email': user.email,
        }
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    """
    Logout and blacklist refresh token
    """
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'detail': 'Successfully logged out'})
    except Exception as e:
        return Response({'detail': 'Error logging out'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    """
    Get current user profile
    """
    user = request.user
    
    try:
        rider = Rider.objects.get(user=user)
        membership_status = rider.membership_status
        zone = rider.zone
    except Rider.DoesNotExist:
        membership_status = 'pending'
        zone = None
    
    return Response({
        'id': user.id,
        'phone': user.username,
        'full_name': f"{user.first_name} {user.last_name}".strip() or user.username,
        'email': user.email,
        'membership_status': membership_status,
        'zone': {
            'id': zone.id,
            'name': zone.name
        } if zone else None
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    """
    Change user password
    """
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')
    
    if not current_password or not new_password or not confirm_password:
        return Response(
            {'detail': 'Current password, new password, and confirmation are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if new_password != confirm_password:
        return Response(
            {'detail': 'New passwords do not match'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if len(new_password) < 6:
        return Response(
            {'detail': 'Password must be at least 6 characters long'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = request.user
    
    # Verify current password
    if not user.check_password(current_password):
        return Response(
            {'detail': 'Current password is incorrect'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Set new password
    user.set_password(new_password)
    user.save()
    
    return Response({
        'detail': 'Password changed successfully'
    })
