from django.contrib import admin
from .models import Grade
# Register your models here.

class GradeAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'student',
        'course',
        'grade',
    )
    list_display_links = ('id', 'student')
    search_fields = ( 
        'course',
    )

admin.site.register(Grade, GradeAdmin)
