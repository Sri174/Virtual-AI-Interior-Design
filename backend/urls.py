from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import GenerateDesignView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('ai_design.urls')), 
    path('api/auth/', include('dj_rest_auth.urls')),  # Login, logout, password change
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/', include('ai_design.urls')),
    path('api/generate/', GenerateDesignView.as_view()),
    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)