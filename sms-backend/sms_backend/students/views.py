from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from users.models import User
from .models import studentProfile
from .serializers import *


class StudentListCreateView(generics.ListCreateAPIView):
    
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if not hasattr(user, 'role'):
            raise PermissionDenied("You do not have a role assigned.")

        if user.role == 'student':
            return studentProfile.objects.filter(user=user)
        
        elif user.role in ['teacher', 'admin']:
            return studentProfile.objects.all()
        
        return studentProfile.objects.none()
    
    def perform_create(self, serializer):
        user = self.request.user
        
        # 1. Just check for permission
        if not hasattr(user, 'role') or user.role not in ['teacher', 'admin']:
            raise PermissionDenied("Only teachers or admins can add students.")
        
        # 2. Let the serializer's 'create' method do all the work.
        serializer.save()

class StudentDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if not hasattr(user, 'role'):
            raise PermissionDenied("You do not have a role assigned.")

        if user.role == 'student':
            return studentProfile.objects.filter(user=user)
        
        elif user.role in ['teacher', 'admin']:
            return studentProfile.objects.all()
        
        return studentProfile.objects.none()
    

class StudentProfileView(generics.RetrieveAPIView):
   
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        
        # Ensure the user is a student
        if not hasattr(user, 'role') or user.role != 'student':
            raise PermissionDenied("You must be a student to view this profile.")
        
        try:
            # Get the profile linked to the logged-in user
            return studentProfile.objects.get(user=user)
        except studentProfile.DoesNotExist:
            raise PermissionDenied("Student profile not found.")