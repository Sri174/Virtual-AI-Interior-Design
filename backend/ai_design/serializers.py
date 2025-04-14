from rest_framework import serializers
from .models import InteriorDesign
from .models import DesignRequest

class InteriorDesignSerializer(serializers.ModelSerializer):
    class Meta:
        model = InteriorDesign
        fields = '__all__'

class DesignRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = DesignRequest
        fields = '__all__'
