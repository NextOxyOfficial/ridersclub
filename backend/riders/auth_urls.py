from django.urls import path
from . import auth_views

urlpatterns = [
    path('login/', auth_views.login_view, name='login'),
    path('logout/', auth_views.logout_view, name='logout'),
    path('user/', auth_views.user_profile_view, name='user_profile'),
    path('change-password/', auth_views.change_password_view, name='change_password'),
    path('update-profile/', auth_views.update_profile_view, name='update_profile'),
]
