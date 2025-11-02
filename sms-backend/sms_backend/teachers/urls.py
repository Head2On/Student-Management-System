from django.urls import path
from .views import TeacherListCreateView, TeacherRetrieveUpdateDestroyView

urlpatterns = [
    # /api/teachers/
    path('', TeacherListCreateView.as_view(), name='teacher-list-create'),
    path('<int:pk>/', TeacherRetrieveUpdateDestroyView.as_view(), name='teacher-detail'),
]