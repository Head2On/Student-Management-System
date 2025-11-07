from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    """Admins can do everything"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_staff


class IsStudentSelf(BasePermission):
    """Student can view only their own records"""
    def has_object_permission(self, request, view, obj):
        # For Marks or Results linked via Enrollment
        if hasattr(obj, "enrollment"):
            return obj.enrollment.student == request.user
        return False


class IsTeacherOrAdmin(BasePermission):
    """Teachers or Admins can add/edit marks; students cannot"""
    def has_permission(self, request, view):
        # Customize later if you add roles for teachers
        return (
            request.user.is_authenticated and
            (request.user.is_staff or hasattr(request.user, "is_teacher") and request.user.is_teacher)
        )


class ReadOnly(BasePermission):
    """Anyone logged in can only read"""
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS
