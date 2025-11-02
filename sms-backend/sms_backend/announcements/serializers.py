from rest_framework import serializers
from .models import Announcement

class AnnouncementSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d Time: %H:%M:%S")

    class Meta:
        model = Announcement
        fields = ['id', 'title', 'message', 'course', 'course_name', 'created_by', 'created_by_name', 'created_at']
        read_only_fields = ['created_by', 'created_at']
