from django.urls import path
from .views import home
from .views import GenerateDesignView, upload_image, home

urlpatterns = [
    path('', home, name='home'),  # Maps the home page to the 'home' view
    path('api/upload/', upload_image, name='upload_image'),
    path('generate-design/', GenerateDesignView.as_view(), name='generate-design'),

]

