from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
     path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
     path('teachers/', TeacherListView.as_view(), name='teacher-list'),
]
