from django.db import models
from django.conf import settings
# Create your models here.

class teachersProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100)
    specialization = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.department}"