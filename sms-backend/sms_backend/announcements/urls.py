from django.urls import path
from .views import *

urlpatterns = [
    path('',AnnouncementListCreateView.as_view(), name='announcement-list-create'),
]
