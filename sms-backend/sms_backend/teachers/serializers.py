from rest_framework import serializers
from .models import teachersProfile

class TeacherSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = teachersProfile
        fields = ['id', 'user', 'username', 'email', 'employee_id', 'department', 'specialization']
        
        extra_kwargs = {
            'user': {'write_only': True, 'required': False} 
        }