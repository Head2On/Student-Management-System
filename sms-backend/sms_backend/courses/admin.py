from django.contrib import admin
from .models import Course 

# 1. Define a new CourseAdmin class
class CourseAdmin(admin.ModelAdmin):
    # This controls the columns in the list view
    list_display = (
        'id', 
        'code', 
        'name', 
        'teacher',
    )
    
    # This makes the ID and Code clickable
    list_display_links = ('id', 'code')
    
    # This adds a search bar
    search_fields = (
        'code', 
        'name', 
        'teacher__username'
    )
    
    # This adds a filter sidebar
    list_filter = ('teacher',)

# 2. Register your Course model with your new custom admin class
admin.site.register(Course, CourseAdmin)