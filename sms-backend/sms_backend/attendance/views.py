from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Attendance
from .serializers import (
    AttendanceSerializer, 
    CourseStudentSerializer, 
    StudentAttendanceSerializer,
    StudentCourseSerializer,
    CreateAttendanceSerializer # Import the new serializer
)
from courses.models import Course
from django.utils.dateparse import parse_date

# --- TEACHER VIEWS ---

class TeacherCourseList(generics.ListAPIView):
   
    serializer_class = CourseStudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Course.objects.filter(teacher=self.request.user)

class AttendanceMarking(APIView):
    """
    API view for a teacher to GET or POST attendance
    records for a specific course and date.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        course_id = request.query_params.get('course_id')
        date_str = request.query_params.get('date') 

        if not course_id or not date_str:
            return Response({"error": "course_id and date are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        date = parse_date(date_str)
        if not date:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Use the correct serializer to show student info
        records = Attendance.objects.filter(course_id=course_id, date=date)
        serializer = StudentAttendanceSerializer(records, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        # Use the CreateAttendanceSerializer to validate and save data
        serializer = CreateAttendanceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save() # This calls the .create() method in the serializer
            return Response({"message": "Attendance saved successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- STUDENT VIEWS ---

class StudentEnrolledCoursesView(generics.ListAPIView):
    """
    API view for a logged-in student to see a list of
    courses they are enrolled in.
    """
    serializer_class = StudentCourseSerializer # Use the simple serializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Course.objects.filter(students=self.request.user)

class StudentAttendanceView(generics.ListAPIView):
    """
    API view for a logged-in student to see their
    attendance records for a specific course.
    """
    serializer_class = AttendanceSerializer # Use the simple serializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        course_id = self.request.query_params.get('course_id')
        if not course_id:
            return Attendance.objects.none()
        
        return Attendance.objects.filter(
            student=self.request.user,
            course_id=course_id
        ).order_by('date')