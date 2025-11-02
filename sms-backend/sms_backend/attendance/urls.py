from django.urls import path
from .views import (
    TeacherCourseList,
    AttendanceMarking,
    StudentEnrolledCoursesView,
    StudentAttendanceView
)

urlpatterns = [
    # Teacher URLs
    path('teacher/courses/', TeacherCourseList.as_view(), name='teacher-course-list'),
    path('teacher/mark/', AttendanceMarking.as_view(), name='teacher-attendance'),
    path('student/courses/', StudentEnrolledCoursesView.as_view(), name='student-enrolled-courses'),
    path('student/my-attendance/', StudentAttendanceView.as_view(), name='student-my-attendance'),
]

