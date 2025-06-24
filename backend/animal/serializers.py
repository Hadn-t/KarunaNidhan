from rest_framework import serializers
from .models import Animal

class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = ['id', 'image', 'details', 'created_at']

from .models import InjuryReport

class InjuryReportSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()

    class Meta:
        model = InjuryReport
        fields = '__all__'