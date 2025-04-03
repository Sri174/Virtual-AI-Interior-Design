from django.urls import path
from .views import home

urlpatterns = [
    path('', home, name='home'),  # Maps the home page to the 'home' view
]
