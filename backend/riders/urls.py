from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'zones', views.ZoneViewSet)
router.register(r'membership-applications', views.MembershipApplicationViewSet)
router.register(r'riders', views.RiderViewSet)
router.register(r'events', views.RideEventViewSet)
router.register(r'posts', views.PostViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
