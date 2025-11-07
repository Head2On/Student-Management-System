from django.db import models

class Classroom(models.Model):
    name = models.CharField(max_length=50, unique=True)  # e.g. "10A"
    section = models.CharField(max_length=10, blank=True, null=True)
    teacher = models.ForeignKey(
        'users.User',  # assuming you have a Teacher model in your teachers app
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='classrooms'
    )

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Subject(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True, null=True)

    # Optional relationships:
    classroom = models.ManyToManyField(
        'school.Classroom', 
        related_name='subjects', 
        blank=True,
        help_text="Select classes that study this subject"
    )

    teacher = models.ForeignKey(
        'users.User', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='subjects'
    )

    def __str__(self):
        return f"{self.name} ({self.code})"
