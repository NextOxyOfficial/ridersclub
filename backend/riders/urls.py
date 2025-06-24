from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'zones', views.ZoneViewSet)
router.register(r'membership-applications', views.MembershipApplicationViewSet)
router.register(r'riders', views.RiderViewSet)
router.register(r'events', views.RideEventViewSet)
router.register(r'posts', views.PostViewSet)
router.register(r'benefit-categories', views.BenefitCategoryViewSet)
router.register(r'benefits', views.BenefitViewSet)
router.register(r'benefit-usage', views.BenefitUsageViewSet)
router.register(r'notices', views.NoticeViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
