from django.urls import path
from .views import *

urlpatterns = [
    path('', StudentListCreateView.as_view(), name='students'),
    path('<int:pk>/', StudentDestroyView.as_view(), name='student-detail'),
    path('profile/', StudentProfileView.as_view(), name='student-profile'),
]
