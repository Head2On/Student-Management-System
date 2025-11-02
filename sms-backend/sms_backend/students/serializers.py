from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from users.models import User
from .models import studentProfile
from courses.models import Course

# --- This is your existing serializer ---
class StudentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=False)

    user_username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    Student_Id = serializers.CharField(source='roll_number', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True, allow_null=True)

    class Meta:
        model = studentProfile
        fields = [
            'id', 'user', 'roll_number', 'phone', 'address', 'avatar_url',
            'department', 'year', 'course', 'username', 'email', 'password',
            'govt_Id', 'date_of_birth','course_name',


            'username', 'email', 'password', 
            'user_username', 'user_email', 'Student_Id'
        ]
        read_only_fields = ['user', 'roll_number']

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def create(self, validated_data):
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        password = validated_data.pop('password', 'default1to9')

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role='student'
        )

        profile = studentProfile(user=user, **validated_data)
        profile.save() 
        return profile


# --- ADD THIS NEW SERIALIZER CLASS ---

# students/serializers.py

class StudentProfileSerializer(serializers.ModelSerializer):
    # ...
    
    # --- FIX THESE FIELDS ---
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True) # <-- FIX
    email = serializers.EmailField(source='user.email', read_only=True)     # <-- FIX
    # --- REMOVE THE PASSWORD FIELD ---
    
    # --- ADD allow_null=True TO PREVENT CRASHES ---
    course_name = serializers.CharField(source='course.name', read_only=True, allow_null=True)
    teacher_first_name = serializers.CharField(source='course.teacher.first_name', read_only=True, allow_null=True)
    teacher_last_name = serializers.CharField(source='course.teacher.last_name', read_only=True, allow_null=True)

    class Meta:
        model = studentProfile
        fields = [
            'first_name', 
            'last_name', 
            'email', 
            'username',
            'roll_number', 
            'phone', 
            'address', 
            'avatar_url', 
            'department',
            'govt_Id',
            'date_of_birth', 
            'year', 
            'course_name', 
            'teacher_first_name',
            'teacher_last_name'
        ]
        # Remove 'email' and 'username' from here, they are read-only now