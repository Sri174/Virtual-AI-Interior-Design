from django.urls import path
from . import views
from .views import home, register
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import GenerateDesignView, upload_image, home
from django.contrib import admin


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),  # Maps the home page to the 'home' view
    path('api/upload/', upload_image, name='upload_image'),    
    path('api/generate-design/',  GenerateDesignView.as_view(), name='ai_design'),
    path('register/', register),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

