from rest_framework import serializers
from .models import Grade

class GradeSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)

    class Meta:
        model = Grade
        fields = ['id', 'student', 'student_name', 'course', 'course_name', 'grade', 'remarks', 'date_assigned']
