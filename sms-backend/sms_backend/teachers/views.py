from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import teachersProfile
from .serializers import TeacherSerializer
from users.models import User  # Make sure to import User

class TeacherListCreateView(generics.ListCreateAPIView):
    """
    Handles GET (list) and POST (create) requests for teachers.
    """
    queryset = teachersProfile.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [IsAuthenticated] # Only logged-in users can see list

    def perform_create(self, serializer):
        user = self.request.user

        # Only admins can create new teachers
        if not hasattr(user, 'role') or user.role != 'admin':
            raise PermissionDenied("Only admins can add new teachers.")

        # Check if user already exists
        username = self.request.data.get('username')
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError(
                {"detail": "A user with this username already exists."}
            )
            
        # Create a new User for the teacher
        teacher_user = User.objects.create_user(
            username=username,
            email=self.request.data.get('email'),
            password=self.request.data.get('password', 'default123'),
            role='teacher'  # Set the role to 'teacher'
        )

        # Save the teacher profile linked to the new User
        serializer.save(user=teacher_user)

class TeacherRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Handles GET (one), PUT, PATCH, and DELETE requests for a teacher.
    """
    queryset = teachersProfile.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [IsAuthenticated] # Can be made stricter (e.g., AdminOnly)

    def perform_update(self, serializer):
        user = self.request.user
        if not hasattr(user, 'role') or user.role != 'admin':
            raise PermissionDenied("Only admins can update teacher profiles.")
        
        # This will only update the profile fields, not the user's email/username
        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        if not hasattr(user, 'role') or user.role != 'admin':
            raise PermissionDenied("Only admins can delete teachers.")
        
        user_account = instance.user  # Get the associated user account
        instance.delete()           # Delete the teacher profile
        user_account.delete()       # Delete the user account