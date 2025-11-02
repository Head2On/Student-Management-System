from django.db import models
from django.conf import settings
from courses.models import Course

class Grade(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        limit_choices_to={'role': 'student'},
        on_delete=models.CASCADE,
        related_name='grades'
    )
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='grades')
    grade = models.CharField(max_length=2)  # e.g., A, B+, C, etc.
    remarks = models.TextField(blank=True)
    date_assigned = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')
        ordering = ['-date_assigned']

    def __str__(self):
        return f"{self.student.username} - {self.course.code}: {self.grade}"
