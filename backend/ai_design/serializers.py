from rest_framework import serializers
from .models import DesignRequest

class DesignRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = DesignRequest
        fields = '__all__'
