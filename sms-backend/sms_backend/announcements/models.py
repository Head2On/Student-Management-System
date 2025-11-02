from django.db import models
from django.conf import settings
from courses.models import Course

class Announcement(models.Model):
    title = models.CharField(max_length=200)
    message = models.TextField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='announcements', null=True, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='announcements_created'
    )
    created_at = models.DateTimeField(auto_now_add=True , )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.course})"
