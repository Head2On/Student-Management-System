from django.contrib import admin
from .models import studentProfile
# Register your models here.

class studentProfileAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'course',
        'department',
    )
    list_display_links = ('id','user','course')
    search_fields = ( 
        'course_id',
    )

admin.site.register(studentProfile, studentProfileAdmin)
