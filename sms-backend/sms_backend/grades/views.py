from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum, Avg
from .permission import *
from .models import (
    AcademicYear, Exam, AssessmentType, GradeScale,
    Enrollment, Mark, ResultSummary
)
from .serializers import (
    AcademicYearSerializer, ExamSerializer, AssessmentTypeSerializer,
    GradeScaleSerializer, EnrollmentSerializer, MarkSerializer, ResultSummarySerializer
)

from grades.services.recompute_results import (
    recompute_ranks_for_exam, compute_cgpa_for_enrollment
)


# --- Master ViewSets (for admin or basic viewing) ---

class AcademicYearViewSet(viewsets.ModelViewSet):
    queryset = AcademicYear.objects.all()
    serializer_class = AcademicYearSerializer
    permission_classes = [IsAdmin | ReadOnly]

class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all().select_related("academic_year")
    serializer_class = ExamSerializer
    permission_classes = [IsAdmin | ReadOnly]


class AssessmentTypeViewSet(viewsets.ModelViewSet):
    queryset = AssessmentType.objects.all()
    serializer_class = AssessmentTypeSerializer
    permission_classes = [IsAdmin | ReadOnly]


class GradeScaleViewSet(viewsets.ModelViewSet):
    queryset = GradeScale.objects.select_related("academic_year").all()
    serializer_class = GradeScaleSerializer
    permission_classes = [IsAdmin | ReadOnly]


# --- Enrollment (used by both teacher & student) ---

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.select_related("student", "academic_year", "classroom").all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsTeacherOrAdmin | ReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["student__username", "admission_no"]


# --- Mark CRUD (teacher/admin) ---

class MarkViewSet(viewsets.ModelViewSet):
    queryset = Mark.objects.select_related(
        "enrollment__student", "subject", "exam", "assessment_type"
    ).all()
    serializer_class = MarkSerializer
    permission_classes = [IsTeacherOrAdmin | ReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        if user.is_staff:
            return qs  # admin sees all
        if hasattr(user, "is_teacher") and user.is_teacher:
            return qs  # later we’ll filter by teacher’s assigned subjects
        # Student → only their marks
        return qs.filter(enrollment__student=user)

# --- ResultSummary (for viewing computed results) ---

class ResultSummaryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ResultSummary.objects.select_related(
        "enrollment__student", "enrollment__classroom", "exam"
    ).all()
    serializer_class = ResultSummarySerializer
    permission_classes = [IsStudentSelf | ReadOnly]

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def my_results(self, request):
        """For students: see their result summaries"""
        student = request.user
        results = ResultSummary.objects.filter(enrollment__student=student)
        serializer = self.get_serializer(results, many=True)
        return Response(serializer.data)
    

    @action(detail=False, methods=["post"], permission_classes=[IsAdmin])
    def recompute(self, request):
        """Recompute results for an exam (admin only)"""
        exam_id = request.data.get("exam_id")
        if not exam_id:
            return Response({"error": "exam_id required"}, status=400)

        from grades.models import Enrollment, Exam
        from grades.services.recompute_results import recompute_result_for_student_exam

        exam = Exam.objects.get(id=exam_id)
        enrollments = Enrollment.objects.filter(academic_year=exam.academic_year)
        count = 0
        for e in enrollments:
            recompute_result_for_student_exam(e, exam)
            count += 1

        return Response({"status": f"Recomputed {count} results for {exam.name}"})

    
    @action(detail=False, methods=["post"], permission_classes=[IsAdmin])
    def recompute_ranks(self, request):
        """Recalculate ranks for a given exam"""
        exam_id = request.data.get("exam_id")
        if not exam_id:
            return Response({"error": "exam_id required"}, status=400)
        from grades.models import Exam
        exam = Exam.objects.get(id=exam_id)
        recompute_ranks_for_exam(exam)
        return Response({"status": f"Ranks recomputed for {exam.name}"})

    @action(detail=False, methods=["get"], permission_classes=[IsStudentSelf])
    def my_cgpa(self, request):
        """Get yearly CGPA for the logged-in student"""
        enrollment = (
            request.user.enrollments.filter(is_active=True).select_related("academic_year").first()
        )
        if not enrollment:
            return Response({"error": "No active enrollment found"}, status=404)

        cgpa = compute_cgpa_for_enrollment(enrollment)
        return Response({"cgpa": cgpa})

    @action(detail=False, methods=["get"], permission_classes=[IsTeacherOrAdmin])
    def top_students(self, request):
        """Get top N students for a given exam (default 3)"""
        exam_id = request.query_params.get("exam_id")
        top_n = int(request.query_params.get("n", 3))
        if not exam_id:
            return Response({"error": "exam_id required"}, status=400)

        results = (
            ResultSummary.objects.filter(exam_id=exam_id)
            .select_related("enrollment__student", "enrollment__classroom")
            .order_by("-percentage")[:top_n]
        )

        data = [
            {
                "student": r.enrollment.student.username,
                "classroom": r.enrollment.classroom.name,
                "percentage": r.percentage,
                "grade": r.grade_letter,
                "rank": r.class_rank,
            }
            for r in results
        ]
        return Response(data)