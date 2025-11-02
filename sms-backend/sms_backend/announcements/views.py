from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated
from .models import Announcement
from .serializers import AnnouncementSerializer

class AnnouncementListCreateView(generics.ListCreateAPIView):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if hasattr(user, 'role'):
            # Teachers see their own + global ones
            if user.role == 'teacher':
                return Announcement.objects.filter(created_by=user) | Announcement.objects.filter(course__teacher=user)

            # Students see announcements for their courses
            elif user.role == 'student':
                return Announcement.objects.filter(course__students=user) | Announcement.objects.filter(course=None)

            # Admins see everything
            elif user.role == 'admin':
                return Announcement.objects.all()

        return Announcement.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if hasattr(user, 'role') and user.role in ['teacher', 'admin']:
            serializer.save(created_by=user)
        else:
            raise serializers.ValidationError("Only teachers or admins can create announcements.")
