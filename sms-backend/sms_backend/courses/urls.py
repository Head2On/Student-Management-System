from django.urls import path
from .views import *

urlpatterns = [
    path('', CourseListCreateView.as_view(), name='courses'),
    path('<int:pk>/', CourseRetrieveUpdateDestroyView.as_view(), name='course-detail'),
]
