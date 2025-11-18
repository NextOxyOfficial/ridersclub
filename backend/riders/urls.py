from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import views

@csrf_exempt
def api_root(request):
    return JsonResponse({
        'message': 'Welcome to Riders Club API',
        'status': 'running',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
            'auth': '/api/auth/',
        }
    })

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
    path('', api_root, name='api-root'),
    path('api/', include(router.urls)),
]
