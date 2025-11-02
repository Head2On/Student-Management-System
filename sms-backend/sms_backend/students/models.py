from django.db import models
from django.conf import settings
from courses.models import Course

class studentProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    roll_number = models.CharField(max_length=8, unique=True) 
    Student_Id = models.CharField(max_length=12, unique=True) 
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='student')
    department = models.CharField(max_length=100)
    year = models.IntegerField()
    date_of_birth = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    address = models.CharField(max_length=200 , blank=True)
    avatar_url = models.ImageField(upload_to='avatars/', blank=True, null=True)
    govt_Id = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.user.username} - {self.Student_Id}"
    
    def save(self, *args, **kwargs):

        if not self.roll_number:
            super().save(*args, **kwargs) 
            new_roll_number = f"{self.course.code.upper()}{self.id:02d}" 
            self.roll_number = new_roll_number
    
            super().save(update_fields=['roll_number'])
        else:
            super().save(*args, **kwargs)
