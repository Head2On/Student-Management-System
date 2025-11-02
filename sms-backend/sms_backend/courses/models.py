from django.db import models
from django.conf import settings

class Course(models.Model):

    STATUS_CHOICES = [
        ('verified', 'Verified'),
        ('unverified', 'Unverified'),
    ]

    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    image=models.ImageField(upload_to='course_image/',blank=True, null=True)
    description = models.TextField(blank=True)
    creation_time = models.DateField(auto_now_add=True)
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        limit_choices_to={'role': 'teacher'},
        on_delete=models.SET_NULL,
        null=True,
        related_name='courses_taught'
    )

    students = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        limit_choices_to={'role': 'student'},
        related_name='enrolled_courses',
        blank=True  # Allows a course to have zero students
    )
    
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='unverified'
    )

    def __str__(self):
        return f"{self.code} - {self.name}"
