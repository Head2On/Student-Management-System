from rest_framework import serializers, generics
from rest_framework.permissions import IsAuthenticated
from .models import Grade
from .serializers import GradeSerializer
from students.models import studentProfile
from rest_framework.exceptions import PermissionDenied # Import this

class GradeListCreateView(generics.ListCreateAPIView):
    # queryset = Grade.objects.all() # <-- REMOVE THIS LINE
    serializer_class = GradeSerializer
    permission_classes = [IsAuthenticated]

    # ADD THIS FUNCTION
    def get_queryset(self):
        """
        Filter grades based on the user's role.
        """
        user = self.request.user

        if not hasattr(user, 'role'):
            # Deny permission if user has no role
            raise PermissionDenied("You do not have a role assigned.")

        if user.role == 'student':
            # Students can only see their own grades
            return Grade.objects.filter(student=user)
        
        elif user.role == 'teacher':
            # Teachers can see grades for their courses
            # You could also change this to Grade.objects.all() if you prefer
            return Grade.objects.filter(course__teacher=user)
        
        elif user.role == 'admin':
            # Admins can see all grades
            return Grade.objects.all()
        
        # As a fallback, return nothing
        return Grade.objects.none()

    def perform_create(self, serializer):
        user = self.request.user

        # We check the role here again for creation
        if user.role not in ['teacher', 'admin']:
            # Use PermissionDenied for permission issues
            raise PermissionDenied("Only teachers or admins can assign grades.")

        student_user = serializer.validated_data['student']  # this is a User object

        try:
            student_profile = studentProfile.objects.get(user=student_user)
        except studentProfile.DoesNotExist:
            raise serializers.ValidationError("This student does not have a studentProfile yet.")

        course = serializer.validated_data['course']

        if user.role == 'teacher' and course.teacher != user:
            raise serializers.ValidationError("You can only assign grades for your own courses.")

        if student_profile.course != course:
            raise serializers.ValidationError("This student is not enrolled in the selected course.")

        serializer.save()
        # update the student's GPA
        
class GradeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    # This view is fine, but the queryset also needs to be dynamic
    # queryset = Grade.objects.all() # <-- REMOVE THIS LINE
    serializer_class = GradeSerializer
    permission_classes = [IsAuthenticated]

    # ADD THIS FUNCTION
    def get_queryset(self):
        """
        Filter grades based on the user's role for detail view.
        """
        user = self.request.user

        if not hasattr(user, 'role'):
            raise PermissionDenied("You do not have a role assigned.")

        if user.role == 'student':
            return Grade.objects.filter(student=user)
        elif user.role == 'teacher':
            return Grade.objects.filter(course__teacher=user)
        elif user.role == 'admin':
            return Grade.objects.all()
        
        return Grade.objects.none()


    def perform_update(self, serializer):
        user = self.request.user

        if user.role not in ['teacher', 'admin']:
            raise PermissionDenied("Only teachers or admins can update grades.")

        grade_instance = self.get_object()
        student_user = serializer.validated_data.get('student', grade_instance.student)
        course = serializer.validated_data.get('course', grade_instance.course)

        try:
            student_profile = studentProfile.objects.get(user=student_user)
        except studentProfile.DoesNotExist:
            raise serializers.ValidationError("This student does not have a StudentProfile yet.")

        # This was 'course' but should be the validated data
        validated_course = serializer.validated_data.get('course', grade_instance.course)

        if user.role == 'teacher' and validated_course.teacher != user:
            raise serializers.ValidationError("You can only update grades for your own courses.")

        if student_profile.course != validated_course:
            raise serializers.ValidationError("This student is not enrolled in the selected course.")

        serializer.save()