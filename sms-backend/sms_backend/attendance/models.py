from django.db import models
from django.conf import settings
# We must import the Course model from the 'courses' app
from courses.models import Course

class Attendance(models.Model):
    """
    Model to store a single attendance record for a student in a course on a specific date.
    """
    STATUS_CHOICES = [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'student'},
        related_name='attendance_records'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )
    date = models.DateField()
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES
    )

    class Meta:
        # This is a critical rule:
        # A student can only have one attendance status per course, per day.
        unique_together = ('student', 'course', 'date')

    def __str__(self):
        # Provides a helpful name in the Django admin
        return f"{self.student.username} - {self.course.code} on {self.date} - {self.status}"

