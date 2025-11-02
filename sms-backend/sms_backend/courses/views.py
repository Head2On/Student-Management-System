from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Course
from .serializers import CourseSerializer

class CourseListCreateView(generics.ListCreateAPIView): # Change this line
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated] 

    def perform_create(self, serializer):
        user = self.request.user
        if not hasattr(user, 'role') or user.role not in ['teacher', 'admin']:
            raise PermissionDenied("You do not have permission to create a course.")
        
        # The serializer will handle the 'teacher' field
        serializer.save()

class CourseRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        user = self.request.user
        if not hasattr(user, 'role') or user.role not in ['teacher', 'admin']:
            raise PermissionDenied("Only teacher and Admin can update course.")
        serializer.save()
        
    def perform_destroy(self, instance):
        user = self.request.user
        if not hasattr(user, 'role') or user.role not in ['teacher', 'admin']:
            raise PermissionDenied("Only teachers or admins can delete courses.")
        instance.delete()