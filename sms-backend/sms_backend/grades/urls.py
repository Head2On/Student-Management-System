from django.urls import path
from .views import *

urlpatterns = [
    path('', GradeListCreateView.as_view(), name='grade-list-create'),
    path('<int:pk>/', GradeRetrieveUpdateDestroyView.as_view(), name='grade-detail'),
]
