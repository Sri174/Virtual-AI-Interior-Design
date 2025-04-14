from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib import admin

from .views import (
    home, register, InteriorDesignUploadView, upload_image, generate_design, GenerateDesignView,
    generate_room_image, design_api, design_ai_room
)


urlpatterns = [
    path('', home, name='home'),

    # Auth
    path('register/', register),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Upload & Generate
    path('api/upload/', upload_image, name='upload_image'),
    path('api/generate/', generate_design, name='generate_design'),
    path('api/generate-stable/', generate_room_image, name='generate_stable'),
    path('api/design/', design_api, name='design_api'),
    path('api/image-to-image/', design_ai_room, name='design_ai_room'),
    path('api/generate-v2/', GenerateDesignView.as_view(), name='generate_v2'),
]

