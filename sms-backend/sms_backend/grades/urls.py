from rest_framework.routers import DefaultRouter
from .views import (
    AcademicYearViewSet, ExamViewSet, AssessmentTypeViewSet,
    GradeScaleViewSet, EnrollmentViewSet, MarkViewSet, ResultSummaryViewSet
)

router = DefaultRouter()
router.register(r'academic-years', AcademicYearViewSet)
router.register(r'exams', ExamViewSet)
router.register(r'assessment-types', AssessmentTypeViewSet)
router.register(r'grade-scales', GradeScaleViewSet)
router.register(r'enrollments', EnrollmentViewSet)
router.register(r'marks', MarkViewSet)
router.register(r'results', ResultSummaryViewSet)

urlpatterns = router.urls
