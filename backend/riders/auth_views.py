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
        rider = None
    
    # Try to get additional details from MembershipApplication
    blood_group = None
    bike_info = None
    address = None
    
    try:
        application = MembershipApplication.objects.get(user=user)
        blood_group = application.blood_group
        if application.has_motorbike and application.motorcycle_brand and application.motorcycle_model:
            bike_info = f"{application.motorcycle_brand} {application.motorcycle_model}"
        address = application.address
    except MembershipApplication.DoesNotExist:
        pass
    
    # Fallback to rider data if available
    if not bike_info and rider and rider.bike_model:
        bike_info = rider.bike_model
    if not address and rider and rider.location:
        address = rider.location
      # Prepare response data
    response_data = {
        'id': user.id,
        'phone': user.username,
        'full_name': f"{user.first_name} {user.last_name}".strip() or user.username,
        'membership_status': membership_status,
        'zone': {
            'id': zone.id,
            'name': zone.name
        } if zone else None,
        'blood_group': blood_group,
    }
    
    # Only include motorcycle if it has data
    if bike_info:
        response_data['bike_model'] = bike_info
    
    return Response(response_data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    """
    Change user password
    """
    current_password = request.data.get('old_password') or request.data.get('current_password')
    new_password = request.data.get('new_password')
    
    if not current_password or not new_password:
        return Response(
            {'detail': 'Current password and new password are required'}, 
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

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile_view(request):
    """
    Update user profile (zone and bike model)
    """
    user = request.user
    
    try:
        rider = Rider.objects.get(user=user)
    except Rider.DoesNotExist:
        return Response(
            {'detail': 'Rider profile not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    zone_id = request.data.get('zone_id')
    bike_model = request.data.get('bike_model')
    
    # Update zone if provided
    if zone_id is not None:
        if zone_id == '':
            rider.zone = None
        else:
            try:
                zone = Zone.objects.get(id=zone_id, is_active=True)
                rider.zone = zone
            except Zone.DoesNotExist:
                return Response(
                    {'detail': 'Invalid zone selected'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
    
    # Update bike model if provided
    if bike_model is not None:
        rider.bike_model = bike_model.strip() if bike_model.strip() else None
    
    rider.save()
    
    # Also update MembershipApplication if exists
    try:
        application = MembershipApplication.objects.get(user=user)
        if zone_id is not None and zone_id != '':
            try:
                zone = Zone.objects.get(id=zone_id, is_active=True)
                application.zone = zone
                application.save()
            except Zone.DoesNotExist:
                pass
        
        if bike_model is not None:
            bike_parts = bike_model.strip().split(' ', 1) if bike_model.strip() else ['', '']
            if len(bike_parts) >= 2:
                application.motorcycle_brand = bike_parts[0]
                application.motorcycle_model = bike_parts[1]
            else:
                application.motorcycle_brand = bike_parts[0] if bike_parts[0] else ''
                application.motorcycle_model = ''
            application.save()
    except MembershipApplication.DoesNotExist:
        pass
      # Return updated profile data
    # Get blood group from MembershipApplication
    blood_group = None
    try:
        application = MembershipApplication.objects.get(user=user)
        blood_group = application.blood_group
    except MembershipApplication.DoesNotExist:
        pass
    
    response_data = {
        'id': user.id,
        'phone': user.username,
        'full_name': f"{user.first_name} {user.last_name}".strip() or user.username,
        'membership_status': rider.membership_status,
        'zone': {
            'id': rider.zone.id,
            'name': rider.zone.name
        } if rider.zone else None,
        'blood_group': blood_group,
        'bike_model': rider.bike_model,
    }
    
    return Response({
        'detail': 'Profile updated successfully',
        'user': response_data
    })
