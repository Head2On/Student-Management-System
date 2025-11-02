from rest_framework import serializers
from .models import Course
from users.models import User


class CourseSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.username', read_only=True)
    teacher = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role__in=['teacher', 'admin']), 
        write_only=True
    )
    
    class Meta:
        model = Course
        fields = ['id', 'code', 'name', 'description', 'teacher_name', 'teacher', 'image', 'price','status']
